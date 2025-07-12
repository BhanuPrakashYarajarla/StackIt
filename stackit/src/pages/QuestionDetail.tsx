import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Check,
  Share2,
  Flag,
  BookmarkPlus,
  Clock,
  User,
  Eye
} from "lucide-react";
import Navbar from "@/components/Navbar";
import RichTextEditor from "@/components/RichTextEditor";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Answer {
  id: number;
  content: string;
  author: string;
  votes: number;
  timestamp: Date;
  isAccepted?: boolean;
}

interface Question {
  id: number;
  title: string;
  description: string;
  tags: string[];
  author: string;
  votes: number;
  views: number;
  timestamp: Date;
  answers: Answer[];
}

const mockQuestion: Question = {
  id: 1,
  title: "How to implement JWT authentication in React?",
  description: `I'm trying to implement JWT authentication in my React application, but I'm facing some issues with token storage and validation.

Here's what I've tried so far:

\`\`\`javascript
const login = async (credentials) => {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  const data = await response.json();
  localStorage.setItem('token', data.token);
};
\`\`\`

**Problems I'm encountering:**
1. How do I properly validate the token on each request?
2. Should I store the token in localStorage or somewhere else?
3. How do I handle token expiration gracefully?

Any help would be appreciated!`,
  tags: ["React", "JWT", "Authentication", "JavaScript"],
  author: "john_dev",
  votes: 15,
  views: 142,
  timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  answers: [
    {
      id: 1,
      content: `Great question! Here's a comprehensive approach to JWT authentication in React:

**1. Token Storage:**
I recommend using \`httpOnly\` cookies instead of localStorage for better security:

\`\`\`javascript
// Set cookie on server side
res.cookie('token', jwt.sign(payload, secret), {
  httpOnly: true,
  secure: true,
  sameSite: 'strict'
});
\`\`\`

**2. Token Validation:**
Create an axios interceptor to handle token validation:

\`\`\`javascript
axios.interceptors.request.use((config) => {
  // Token will be automatically sent with cookies
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
\`\`\`

**3. Context for Auth State:**
\`\`\`javascript
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('/api/me');
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};
\`\`\`

This approach is more secure and handles token expiration automatically.`,
      author: "react_expert",
      votes: 23,
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      isAccepted: true
    },
    {
      id: 2,
      content: `Another approach is to use a custom hook for authentication:

\`\`\`javascript
const useAuth = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = async (credentials) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    if (response.ok) {
      const { token } = await response.json();
      localStorage.setItem('token', token);
      setToken(token);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return { token, login, logout };
};
\`\`\`

Don't forget to add the token to your API requests!`,
      author: "dev_helper",
      votes: 8,
      timestamp: new Date(Date.now() - 30 * 60 * 1000)
    }
  ]
};

const QuestionDetail = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState<Question>(mockQuestion);
  const [newAnswer, setNewAnswer] = useState("");
  const [userVotes, setUserVotes] = useState<{[key: string]: 'up' | 'down' | null}>({});

  const handleVote = (type: 'up' | 'down', targetId: string, targetType: 'question' | 'answer') => {
    const currentVote = userVotes[targetId];
    let newVote: 'up' | 'down' | null = type;
    
    if (currentVote === type) {
      newVote = null; // Remove vote if clicking same button
    }

    setUserVotes(prev => ({ ...prev, [targetId]: newVote }));

    // Update vote counts (in real app, this would be an API call)
    if (targetType === 'question') {
      setQuestion(prev => ({
        ...prev,
        votes: prev.votes + (newVote === 'up' ? 1 : newVote === 'down' ? -1 : 0) -
               (currentVote === 'up' ? 1 : currentVote === 'down' ? -1 : 0)
      }));
    } else {
      setQuestion(prev => ({
        ...prev,
        answers: prev.answers.map(answer => 
          answer.id.toString() === targetId 
            ? {
                ...answer,
                votes: answer.votes + (newVote === 'up' ? 1 : newVote === 'down' ? -1 : 0) -
                       (currentVote === 'up' ? 1 : currentVote === 'down' ? -1 : 0)
              }
            : answer
        )
      }));
    }
  };

  const handleAcceptAnswer = (answerId: number) => {
    setQuestion(prev => ({
      ...prev,
      answers: prev.answers.map(answer => ({
        ...answer,
        isAccepted: answer.id === answerId ? !answer.isAccepted : false
      }))
    }));
  };

  const handleSubmitAnswer = () => {
    if (!newAnswer.trim()) return;

    const answer: Answer = {
      id: question.answers.length + 1,
      content: newAnswer,
      author: "current_user",
      votes: 0,
      timestamp: new Date()
    };

    setQuestion(prev => ({
      ...prev,
      answers: [...prev.answers, answer]
    }));

    setNewAnswer("");
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const VoteButtons = ({ 
    votes, 
    targetId, 
    targetType, 
    showAccept = false, 
    isAccepted = false, 
    onAccept 
  }: {
    votes: number;
    targetId: string;
    targetType: 'question' | 'answer';
    showAccept?: boolean;
    isAccepted?: boolean;
    onAccept?: () => void;
  }) => {
    const currentVote = userVotes[targetId];
    
    return (
      <div className="flex flex-col items-center space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleVote('up', targetId, targetType)}
          className={`h-8 w-8 p-0 ${currentVote === 'up' ? 'text-green-600 bg-green-50' : 'hover:text-green-600'}`}
        >
          <ThumbsUp className="h-4 w-4" />
        </Button>
        
        <span className={`font-semibold ${votes > 0 ? 'text-green-600' : votes < 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
          {votes}
        </span>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleVote('down', targetId, targetType)}
          className={`h-8 w-8 p-0 ${currentVote === 'down' ? 'text-red-600 bg-red-50' : 'hover:text-red-600'}`}
        >
          <ThumbsDown className="h-4 w-4" />
        </Button>

        {showAccept && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onAccept}
            className={`h-8 w-8 p-0 ${isAccepted ? 'text-green-600 bg-green-50' : 'hover:text-green-600'}`}
          >
            <Check className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
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
                <BreadcrumbPage className="text-foreground font-medium">Question</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Question Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            {question.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Asked {formatTimeAgo(question.timestamp)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{question.views} views</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <Link to={`/user/${question.author}`} className="text-blue-600 hover:underline">
                {question.author}
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {question.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="bg-blue-100 text-blue-700">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Question Content */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <VoteButtons
                votes={question.votes}
                targetId="question"
                targetType="question"
              />
              
              <div className="flex-1">
                <div className="prose max-w-none mb-4">
                  <div className="whitespace-pre-wrap text-foreground">{question.description}</div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                    <Button variant="ghost" size="sm">
                      <BookmarkPlus className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Flag className="h-4 w-4 mr-1" />
                      Flag
                    </Button>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    asked by <span className="font-medium text-blue-600">{question.author}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Answers Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            {question.answers.length} {question.answers.length === 1 ? 'Answer' : 'Answers'}
          </h2>
          
          <div className="space-y-6">
            {question.answers.map(answer => (
              <Card key={answer.id} className={`bg-white/80 backdrop-blur-sm ${answer.isAccepted ? 'ring-2 ring-green-200' : ''}`}>
                <CardContent className="p-6">
                  {answer.isAccepted && (
                    <div className="flex items-center gap-2 mb-4 text-green-600">
                      <Check className="h-5 w-5" />
                      <span className="font-medium">Accepted Answer</span>
                    </div>
                  )}
                  
                  <div className="flex gap-4">
                    <VoteButtons
                      votes={answer.votes}
                      targetId={answer.id.toString()}
                      targetType="answer"
                      showAccept={question.author === "john_dev"} // Only question author can accept
                      isAccepted={answer.isAccepted}
                      onAccept={() => handleAcceptAnswer(answer.id)}
                    />
                    
                    <div className="flex-1">
                      <div className="prose max-w-none mb-4">
                        <div className="whitespace-pre-wrap text-foreground">{answer.content}</div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Comment
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="h-4 w-4 mr-1" />
                            Share
                          </Button>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          answered {formatTimeAgo(answer.timestamp)} by{" "}
                          <span className="font-medium text-blue-600">{answer.author}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Answer Form */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Your Answer</h3>
            
            <div className="mb-4">
              <RichTextEditor
                value={newAnswer}
                onChange={setNewAnswer}
                placeholder="Write your answer here. Be specific and provide examples when possible."
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                onClick={handleSubmitAnswer}
                disabled={!newAnswer.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Post Your Answer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuestionDetail;
