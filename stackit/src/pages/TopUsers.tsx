
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Medal, Award, TrendingUp, MessageSquare, ThumbsUp, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface TopUser {
  id: number;
  username: string;
  reputation: number;
  questionsAsked: number;
  answersGiven: number;
  acceptedAnswers: number;
  badges: {
    gold: number;
    silver: number;
    bronze: number;
  };
  topTags: string[];
  joinDate: Date;
}

const mockTopUsers: TopUser[] = [
  {
    id: 1,
    username: "react_expert",
    reputation: 15420,
    questionsAsked: 45,
    answersGiven: 234,
    acceptedAnswers: 187,
    badges: { gold: 12, silver: 28, bronze: 45 },
    topTags: ["React", "JavaScript", "TypeScript", "Node.js"],
    joinDate: new Date(2020, 2, 15)
  },
  {
    id: 2,
    username: "python_guru",
    reputation: 12890,
    questionsAsked: 23,
    answersGiven: 198,
    acceptedAnswers: 156,
    badges: { gold: 8, silver: 22, bronze: 38 },
    topTags: ["Python", "Django", "Flask", "Data Science"],
    joinDate: new Date(2019, 8, 22)
  },
  {
    id: 3,
    username: "fullstack_dev",
    reputation: 11250,
    questionsAsked: 67,
    answersGiven: 145,
    acceptedAnswers: 112,
    badges: { gold: 6, silver: 19, bronze: 42 },
    topTags: ["JavaScript", "React", "Node.js", "MongoDB"],
    joinDate: new Date(2021, 1, 8)
  },
  {
    id: 4,
    username: "css_wizard",
    reputation: 9870,
    questionsAsked: 34,
    answersGiven: 167,
    acceptedAnswers: 134,
    badges: { gold: 5, silver: 16, bronze: 29 },
    topTags: ["CSS", "HTML", "Sass", "Tailwind"],
    joinDate: new Date(2020, 11, 3)
  },
  {
    id: 5,
    username: "backend_ninja",
    reputation: 8945,
    questionsAsked: 19,
    answersGiven: 156,
    acceptedAnswers: 123,
    badges: { gold: 4, silver: 14, bronze: 31 },
    topTags: ["Node.js", "Express", "MongoDB", "PostgreSQL"],
    joinDate: new Date(2021, 5, 17)
  }
];

const TopUsers = () => {
  const formatJoinDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 1:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 2:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-foreground font-medium">Top Users</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Top Users</h1>
          <p className="text-muted-foreground text-lg">
            Our most active and helpful community members
          </p>
        </div>

        {/* Top Users List */}
        <div className="space-y-4">
          {mockTopUsers.map((user, index) => (
            <Card key={user.id} className="bg-white/80 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  {/* Rank */}
                  <div className="flex items-center justify-center w-12 h-12">
                    {getRankIcon(index)}
                  </div>

                  {/* Avatar */}
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg">
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-foreground">
                        {user.username}
                      </h3>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {user.reputation.toLocaleString()} reputation
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MessageSquare className="h-4 w-4" />
                        <span>{user.questionsAsked} questions</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <TrendingUp className="h-4 w-4" />
                        <span>{user.answersGiven} answers</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-green-600">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{user.acceptedAnswers} accepted</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>Member since {formatJoinDate(user.joinDate)}</span>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <span className="text-sm text-muted-foreground">{user.badges.gold}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                        <span className="text-sm text-muted-foreground">{user.badges.silver}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-amber-600"></div>
                        <span className="text-sm text-muted-foreground">{user.badges.bronze}</span>
                      </div>
                    </div>

                    {/* Top Tags */}
                    <div className="flex flex-wrap gap-2">
                      {user.topTags.map(tag => (
                        <Badge key={tag} variant="secondary" className="bg-blue-100 text-blue-700">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopUsers;
