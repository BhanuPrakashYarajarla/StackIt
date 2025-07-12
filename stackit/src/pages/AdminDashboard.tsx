
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Users,
  MessageSquare,
  Flag,
  TrendingUp,
  Shield,
  Ban,
  CheckCircle,
  XCircle,
  Send,
  Download,
  Activity
} from "lucide-react";
import Navbar from "@/components/Navbar";

interface ReportedContent {
  id: number;
  type: 'question' | 'answer';
  title: string;
  author: string;
  reason: string;
  reportedBy: string;
  timestamp: Date;
  status: 'pending' | 'resolved' | 'dismissed';
}

interface User {
  id: number;
  username: string;
  email: string;
  reputation: number;
  joinDate: Date;
  status: 'active' | 'banned' | 'suspended';
  questionsCount: number;
  answersCount: number;
}

const mockReports: ReportedContent[] = [
  {
    id: 1,
    type: 'question',
    title: 'How to hack a website?',
    author: 'suspicious_user',
    reason: 'Inappropriate content',
    reportedBy: 'community_user',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'pending'
  },
  {
    id: 2,
    type: 'answer',
    title: 'Response to: Best React practices',
    author: 'spam_account',
    reason: 'Spam/Self-promotion',
    reportedBy: 'moderator1',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    status: 'pending'
  }
];

const mockUsers: User[] = [
  {
    id: 1,
    username: 'john_dev',
    email: 'john@example.com',
    reputation: 1250,
    joinDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    status: 'active',
    questionsCount: 15,
    answersCount: 42
  },
  {
    id: 2,
    username: 'suspicious_user',
    email: 'sus@example.com',
    reputation: -50,
    joinDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'active',
    questionsCount: 3,
    answersCount: 1
  }
];

const AdminDashboard = () => {
  const [reports, setReports] = useState<ReportedContent[]>(mockReports);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [announcement, setAnnouncement] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleResolveReport = (reportId: number, action: 'resolve' | 'dismiss') => {
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { ...report, status: action === 'resolve' ? 'resolved' : 'dismissed' }
        : report
    ));
  };

  const handleBanUser = (userId: number) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: 'banned' }
        : user
    ));
  };

  const handleSendAnnouncement = () => {
    if (announcement.trim()) {
      // In a real app, this would send to all users
      console.log("Sending announcement:", announcement);
      setAnnouncement("");
      // Show success message
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    pendingReports: reports.filter(r => r.status === 'pending').length,
    totalQuestions: users.reduce((sum, user) => sum + user.questionsCount, 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, content, and platform settings</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-green-600">{stats.activeUsers}</p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Reports</p>
                  <p className="text-2xl font-bold text-red-600">{stats.pendingReports}</p>
                </div>
                <Flag className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Questions</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.totalQuestions}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="reports" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="reports">Content Reports</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Content Reports */}
          <TabsContent value="reports">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flag className="h-5 w-5" />
                  Reported Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.map(report => (
                    <div key={report.id} className="p-4 border rounded-lg bg-white/50">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={report.type === 'question' ? 'default' : 'secondary'}>
                              {report.type}
                            </Badge>
                            <Badge 
                              variant={
                                report.status === 'pending' ? 'destructive' : 
                                report.status === 'resolved' ? 'default' : 'secondary'
                              }
                            >
                              {report.status}
                            </Badge>
                          </div>
                          <h4 className="font-medium text-gray-900">{report.title}</h4>
                          <p className="text-sm text-gray-600">
                            by <span className="font-medium">{report.author}</span>
                          </p>
                          <p className="text-sm text-red-600 mt-1">
                            Reason: {report.reason}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Reported by {report.reportedBy} on {formatDate(report.timestamp)}
                          </p>
                        </div>
                        
                        {report.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleResolveReport(report.id, 'dismiss')}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Dismiss
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleResolveReport(report.id, 'resolve')}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Resolve
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Management */}
          <TabsContent value="users">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map(user => (
                    <div key={user.id} className="p-4 border rounded-lg bg-white/50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900">{user.username}</h4>
                            <Badge 
                              variant={
                                user.status === 'active' ? 'default' : 
                                user.status === 'banned' ? 'destructive' : 'secondary'
                              }
                            >
                              {user.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span>Reputation: {user.reputation}</span>
                            <span>Questions: {user.questionsCount}</span>
                            <span>Answers: {user.answersCount}</span>
                            <span>Joined: {user.joinDate.toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Shield className="h-4 w-4 mr-1" />
                                Actions
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>User Actions - {user.username}</DialogTitle>
                                <DialogDescription>
                                  Choose an action to perform on this user account.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button 
                                      variant="destructive" 
                                      className="w-full"
                                      disabled={user.status === 'banned'}
                                    >
                                      <Ban className="h-4 w-4 mr-2" />
                                      Ban User
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Ban User</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to ban {user.username}? This action will prevent them from accessing the platform.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleBanUser(user.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Ban User
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Announcements */}
          <TabsContent value="announcements">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Send Announcement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Write your announcement message here..."
                    value={announcement}
                    onChange={(e) => setAnnouncement(e.target.value)}
                    className="min-h-32"
                  />
                  <Button onClick={handleSendAnnouncement} disabled={!announcement.trim()}>
                    <Send className="h-4 w-4 mr-2" />
                    Send to All Users
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Platform Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Questions:</span>
                      <span className="font-semibold">{stats.totalQuestions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Answers:</span>
                      <span className="font-semibold">{users.reduce((sum, user) => sum + user.answersCount, 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Reputation:</span>
                      <span className="font-semibold">
                        {Math.round(users.reduce((sum, user) => sum + user.reputation, 0) / users.length)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Export Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Export User Data
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Export Questions
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Export Reports Log
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
