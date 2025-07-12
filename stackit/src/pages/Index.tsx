import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, TrendingUp, MessageSquare, ThumbsUp, ThumbsDown, Check, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import AskQuestionModal from "@/components/AskQuestionModal";
import LoginModal from "@/components/LoginModal";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Question {
  id: number;
  title: string;
  description: string;
  tags: string[];
  author: string;
  votes: number;
  answers: number;
  views: number;
  timestamp: Date;
  hasAcceptedAnswer?: boolean;
  userVote?: 'up' | 'down' | null;
}

const mockQuestions: Question[] = [
  {
    id: 1,
    title: "How to join two columns in a pandas DataFrame?",
    description: "I have two DataFrames and I want to merge them based on a common column. What is the best way to do this in pandas? I have tried using concat but it's...",
    tags: ["python", "pandas", "dataframe", "merge"],
    author: "alice_dev",
    votes: 12,
    answers: 3,
    views: 142,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    hasAcceptedAnswer: true
  },
  {
    id: 2,
    title: "React useEffect cleanup function not working",
    description: "I'm trying to clean up my useEffect but the cleanup function seems to not be called when the component unmounts. Here's my code...",
    tags: ["react", "hooks", "useEffect", "cleanup"],
    author: "react_newbie",
    votes: 8,
    answers: 1,
    views: 89,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
  },
  {
    id: 3,
    title: "CSS Grid vs Flexbox - when to use which?",
    description: "I'm confused about when to use CSS Grid and when to use Flexbox. Both seem to do similar things but I'm not sure about the best practices...",
    tags: ["css", "grid", "flexbox", "layout"],
    author: "css_learner",
    votes: 24,
    answers: 5,
    views: 256,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
  },
  {
    id: 4,
    title: "How to implement JWT authentication in Node.js?",
    description: "I need to implement JWT authentication in my Node.js application but I'm not sure about the best practices for token storage and validation...",
    tags: ["nodejs", "jwt", "authentication", "security"],
    author: "backend_dev",
    votes: 15,
    answers: 2,
    views: 178,
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000)
  },
  {
    id: 5,
    title: "TypeScript generics explained with examples",
    description: "Can someone explain TypeScript generics with practical examples? I understand the basic concept but I'm struggling with more complex use cases...",
    tags: ["typescript", "generics", "types", "javascript"],
    author: "ts_learner",
    votes: 19,
    answers: 4,
    views: 203,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    hasAcceptedAnswer: true
  },
  {
    id: 6,
    title: "Docker container networking issues",
    description: "I'm having trouble with Docker container networking. My containers can't communicate with each other even though they're on the same network...",
    tags: ["docker", "networking", "containers", "devops"],
    author: "devops_engineer",
    votes: 7,
    answers: 1,
    views: 95,
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000)
  },
  {
    id: 7,
    title: "MongoDB aggregation pipeline optimization",
    description: "My MongoDB aggregation queries are running very slowly. What are the best practices for optimizing aggregation pipelines?",
    tags: ["mongodb", "aggregation", "performance", "database"],
    author: "db_admin",
    votes: 11,
    answers: 2,
    views: 134,
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000)
  },
  {
    id: 8,
    title: "Vue.js vs React - which one to choose?",
    description: "I'm starting a new project and can't decide between Vue.js and React. What are the pros and cons of each framework?",
    tags: ["vue", "react", "frontend", "comparison"],
    author: "frontend_dev",
    votes: 22,
    answers: 6,
    views: 287,
    timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000),
    hasAcceptedAnswer: true
  },
  {
    id: 9,
    title: "AWS Lambda cold start optimization",
    description: "My AWS Lambda functions are experiencing long cold start times. What are the best strategies to optimize Lambda cold starts?",
    tags: ["aws", "lambda", "serverless", "performance"],
    author: "cloud_architect",
    votes: 16,
    answers: 3,
    views: 189,
    timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000)
  },
  {
    id: 10,
    title: "Python async/await best practices",
    description: "I'm new to async programming in Python. What are the best practices for using async/await effectively?",
    tags: ["python", "async", "asyncio", "concurrency"],
    author: "python_dev",
    votes: 13,
    answers: 2,
    views: 156,
    timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000)
  }
];

const popularTags = ["React", "JavaScript", "TypeScript", "Node.js", "Python", "CSS", "HTML", "JWT", "API"];

const Index = () => {
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showAskModal, setShowAskModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "votes" | "activity">("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const questionsPerPage = 5;
  const location = useLocation();

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || q.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    switch (sortBy) {
      case "votes":
        return b.votes - a.votes;
      case "activity":
        return b.answers - a.answers;
      default:
        return b.timestamp.getTime() - a.timestamp.getTime();
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedQuestions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const paginatedQuestions = sortedQuestions.slice(startIndex, startIndex + questionsPerPage);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const isUserLoggedIn = () => {
    return !!localStorage.getItem('user');
  };

  const handleVote = (questionId: number, voteType: 'up' | 'down') => {
    if (!isUserLoggedIn()) {
      setShowLoginModal(true);
      return;
    }

    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        const currentVote = q.userVote;
        let newVote: 'up' | 'down' | null = voteType;
        let voteChange = 0;

        if (currentVote === voteType) {
          // Remove vote
          newVote = null;
          voteChange = voteType === 'up' ? -1 : 1;
        } else if (currentVote === null) {
          // Add new vote
          voteChange = voteType === 'up' ? 1 : -1;
        } else {
          // Change vote
          voteChange = voteType === 'up' ? 2 : -2;
        }

        return {
          ...q,
          votes: q.votes + voteChange,
          userVote: newVote
        };
      }
      return q;
    }));
  };

  const handleAskQuestion = () => {
    if (!isUserLoggedIn()) {
      setShowLoginModal(true);
      return;
    }
    setShowAskModal(true);
  };

  const handleAddQuestion = (questionData: any) => {
    const newQuestion: Question = {
      id: questions.length + 1,
      title: questionData.title,
      description: questionData.description,
      tags: questionData.tags,
      author: "current_user",
      votes: 0,
      answers: 0,
      views: 0,
      timestamp: new Date(),
      userVote: null
    };
    setQuestions([newQuestion, ...questions]);
    setShowAskModal(false);
    setCurrentPage(1); // Reset to first page to show new question
  };

  // Generate pagination items
  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(i);
              }}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage(1);
            }}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis if needed
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show current page and neighbors
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(i);
                }}
                isActive={currentPage === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      // Show ellipsis if needed
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show last page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(totalPages);
              }}
              isActive={currentPage === totalPages}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-foreground font-medium">Home</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Welcome to <span className="text-blue-600">StackIt</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Ask questions, share knowledge, and grow together
              </p>
            </div>
            
            {/* Prominent Ask Question Button */}
            <Button 
              onClick={handleAskQuestion}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Ask Question
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/80 backdrop-blur-sm border-border focus:border-blue-400 transition-colors"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={sortBy === "newest" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("newest")}
                className="bg-white/80 backdrop-blur-sm"
              >
                Newest
              </Button>
              <Button
                variant={sortBy === "votes" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("votes")}
                className="bg-white/80 backdrop-blur-sm"
              >
                <TrendingUp className="h-4 w-4 mr-1" />
                Top Voted
              </Button>
              <Button
                variant={sortBy === "activity" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("activity")}
                className="bg-white/80 backdrop-blur-sm"
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Most Answers
              </Button>
            </div>
          </div>

          {/* Popular Tags */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedTag === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag(null)}
              className="bg-white/80 backdrop-blur-sm"
            >
              All Topics
            </Button>
            {popularTags.map(tag => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className="bg-white/80 backdrop-blur-sm"
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4 mb-8">
          {paginatedQuestions.map(question => (
            <Card key={question.id} className="bg-white/80 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-200 hover:scale-[1.01]">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Voting Section */}
                  <div className="flex lg:flex-col gap-4 lg:gap-2 items-center lg:items-start lg:min-w-[120px]">
                    <div className="flex lg:flex-col items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVote(question.id, 'up')}
                        className={`h-8 w-8 p-0 ${question.userVote === 'up' ? 'text-green-600 bg-green-50' : 'hover:text-green-600'}`}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      
                      <span className={`font-semibold text-lg ${question.votes > 0 ? 'text-green-600' : question.votes < 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
                        {question.votes}
                      </span>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVote(question.id, 'down')}
                        className={`h-8 w-8 p-0 ${question.userVote === 'down' ? 'text-red-600 bg-red-50' : 'hover:text-red-600'}`}
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex lg:flex-col gap-4 lg:gap-2 text-center lg:text-left">
                      <div className="flex items-center gap-1 text-sm">
                        <MessageSquare className="h-4 w-4" />
                        <span className={`font-medium ${question.hasAcceptedAnswer ? 'text-green-600' : 'text-muted-foreground'}`}>
                          {question.answers}
                        </span>
                        {question.hasAcceptedAnswer && (
                          <Check className="h-4 w-4 text-green-600 ml-1" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        <span>{question.views}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <Link 
                      to={`/question/${question.id}`}
                      className="block mb-2 hover:text-blue-600 transition-colors"
                    >
                      <h3 className="text-lg font-semibold text-foreground line-clamp-2">
                        {question.title}
                      </h3>
                    </Link>
                    
                    <p className="text-muted-foreground mb-3 line-clamp-2">
                      {question.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {question.tags.map(tag => (
                        <Badge 
                          key={tag} 
                          variant="secondary"
                          className="bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer transition-colors"
                          onClick={() => setSelectedTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>
                        asked by <span className="font-medium text-blue-600">{question.author}</span>
                      </span>
                      <span>{formatTimeAgo(question.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mb-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) {
                        setCurrentPage(currentPage - 1);
                      }
                    }}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                
                {generatePaginationItems()}
                
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) {
                        setCurrentPage(currentPage + 1);
                      }
                    }}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {/* No Results */}
        {sortedQuestions.length === 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-border text-center py-12">
            <CardContent>
              <h3 className="text-lg font-semibold text-foreground mb-2">No questions found</h3>
              <p className="text-muted-foreground mb-4">
                {selectedTag ? `No questions tagged with "${selectedTag}"` : "No questions match your search"}
              </p>
              <Button onClick={handleAskQuestion} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Ask the First Question
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Ask Question Modal */}
      <AskQuestionModal
        open={showAskModal}
        onOpenChange={setShowAskModal}
        onSubmit={handleAddQuestion}
      />

      {/* Login Modal */}
      <LoginModal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
        onLogin={() => {
          setIsLoggedIn(true);
          setShowLoginModal(false);
        }}
      />
    </div>
  );
};

export default Index;
