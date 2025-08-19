import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus, GraduationCap, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface Course {
  id: string;
  name: string;
  grade: string;
  credits: number;
}

const gradePoints: { [key: string]: number } = {
  'A+': 4.0,
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D+': 1.3,
  'D': 1.0,
  'F': 0.0
};

const CGPACalculator = () => {
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: '', grade: '', credits: 0 }
  ]);
  const [cgpa, setCGPA] = useState<number>(0);

  const addCourse = () => {
    const newCourse: Course = {
      id: Date.now().toString(),
      name: '',
      grade: '',
      credits: 0
    };
    setCourses([...courses, newCourse]);
    toast.success('New course added!');
  };

  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses(courses.filter(course => course.id !== id));
      toast.success('Course removed!');
    }
  };

  const updateCourse = (id: string, field: keyof Course, value: string | number) => {
    setCourses(courses.map(course =>
      course.id === id ? { ...course, [field]: value } : course
    ));
  };

  const calculateCGPA = () => {
    const validCourses = courses.filter(course => 
      course.grade && course.credits > 0
    );

    if (validCourses.length === 0) {
      setCGPA(0);
      return;
    }

    const totalPoints = validCourses.reduce((sum, course) => 
      sum + (gradePoints[course.grade] * course.credits), 0
    );
    
    const totalCredits = validCourses.reduce((sum, course) => 
      sum + course.credits, 0
    );

    const calculatedCGPA = totalCredits > 0 ? totalPoints / totalCredits : 0;
    setCGPA(calculatedCGPA);
  };

  useEffect(() => {
    calculateCGPA();
  }, [courses]);

  const getGradeColor = (cgpa: number) => {
    if (cgpa >= 3.5) return 'text-accent';
    if (cgpa >= 3.0) return 'text-primary';
    if (cgpa >= 2.5) return 'text-yellow-600';
    return 'text-destructive';
  };

  const getPerformanceText = (cgpa: number) => {
    if (cgpa >= 3.7) return 'Excellent';
    if (cgpa >= 3.3) return 'Very Good';
    if (cgpa >= 3.0) return 'Good';
    if (cgpa >= 2.7) return 'Satisfactory';
    if (cgpa >= 2.0) return 'Needs Improvement';
    return 'Poor';
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-academic rounded-full shadow-academic">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-academic bg-clip-text text-transparent">
              CGPA Calculator
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Calculate your Cumulative Grade Point Average with ease. Add your courses, 
            grades, and credit hours to get your real-time CGPA.
          </p>
        </div>

        {/* CGPA Display */}
        <Card className="shadow-elevated border-0 bg-gradient-academic">
          <CardContent className="pt-6">
            <div className="text-center text-white">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="h-6 w-6" />
                <span className="text-lg font-medium">Your CGPA</span>
              </div>
              <div className="text-5xl font-bold mb-2">
                {cgpa.toFixed(2)}
              </div>
              <div className="text-xl opacity-90">
                {getPerformanceText(cgpa)}
              </div>
              <div className="text-sm opacity-75 mt-2">
                Out of 4.00 scale
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grade Scale Reference */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-primary">Grade Scale Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {Object.entries(gradePoints).map(([grade, points]) => (
                <div key={grade} className="text-center p-2 bg-muted rounded-lg">
                  <div className="font-bold text-primary">{grade}</div>
                  <div className="text-sm text-muted-foreground">{points.toFixed(1)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Courses Section */}
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-primary">Course Details</CardTitle>
            <Button 
              onClick={addCourse} 
              variant="outline" 
              size="sm"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {courses.map((course, index) => (
              <div key={course.id} className="p-4 bg-academic-muted rounded-lg border border-border">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div className="space-y-2">
                    <Label htmlFor={`course-${course.id}`}>Course Name</Label>
                    <Input
                      id={`course-${course.id}`}
                      placeholder="e.g., Mathematics 101"
                      value={course.name}
                      onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                      className="border-input focus:border-primary"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`grade-${course.id}`}>Grade</Label>
                    <Select
                      value={course.grade}
                      onValueChange={(value) => updateCourse(course.id, 'grade', value)}
                    >
                      <SelectTrigger className="border-input focus:border-primary">
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(gradePoints).map((grade) => (
                          <SelectItem key={grade} value={grade}>
                            {grade} ({gradePoints[grade].toFixed(1)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`credits-${course.id}`}>Credit Hours</Label>
                    <Input
                      id={`credits-${course.id}`}
                      type="number"
                      min="0"
                      max="6"
                      step="0.5"
                      placeholder="3"
                      value={course.credits || ''}
                      onChange={(e) => updateCourse(course.id, 'credits', parseFloat(e.target.value) || 0)}
                      className="border-input focus:border-primary"
                    />
                  </div>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeCourse(course.id)}
                    disabled={courses.length === 1}
                    className="self-end"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-academic-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {courses.filter(c => c.grade && c.credits > 0).length}
                </div>
                <div className="text-sm text-muted-foreground">Courses Added</div>
              </div>
              <div className="p-4 bg-academic-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {courses.reduce((sum, c) => sum + (c.credits || 0), 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Credits</div>
              </div>
              <div className="p-4 bg-academic-muted rounded-lg">
                <div className={`text-2xl font-bold ${getGradeColor(cgpa)}`}>
                  {cgpa.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Current CGPA</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CGPACalculator;