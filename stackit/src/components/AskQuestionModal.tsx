
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, Plus, Tag, Bold, Italic, List, ListOrdered, Link as LinkIcon } from "lucide-react";

interface AskQuestionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { title: string; description: string; tags: string[] }) => void;
}

const suggestedTags = [
  "React", "JavaScript", "TypeScript", "Node.js", "Python", "CSS", "HTML",
  "Vue", "Angular", "Express", "MongoDB", "SQL", "API", "JWT", "Authentication"
];

const AskQuestionModal = ({ open, onOpenChange, onSubmit }: AskQuestionModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleAddTag = (tag: string) => {
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const insertTextAtCursor = (textarea: HTMLTextAreaElement, textToInsert: string, wrapText = false) => {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let newText;
    if (wrapText && selectedText) {
      newText = textToInsert + selectedText + textToInsert;
    } else {
      newText = textToInsert;
    }
    
    const newValue = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
    setDescription(newValue);
    
    // Set cursor position after insertion
    setTimeout(() => {
      const newPosition = start + (wrapText && selectedText ? textToInsert.length : newText.length);
      textarea.setSelectionRange(newPosition, newPosition);
      textarea.focus();
    }, 0);
  };

  const handleFormatting = (type: string) => {
    const textarea = document.getElementById('description') as HTMLTextAreaElement;
    if (!textarea) return;

    switch (type) {
      case 'bold':
        insertTextAtCursor(textarea, '**', true);
        break;
      case 'italic':
        insertTextAtCursor(textarea, '*', true);
        break;
      case 'bullet':
        insertTextAtCursor(textarea, '\n- ');
        break;
      case 'numbered':
        insertTextAtCursor(textarea, '\n1. ');
        break;
      case 'link':
        insertTextAtCursor(textarea, '[link text](url)');
        break;
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.length < 10) {
      newErrors.title = "Title must be at least 10 characters";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    } else if (description.length < 30) {
      newErrors.description = "Description must be at least 30 characters";
    }

    if (tags.length === 0) {
      newErrors.tags = "At least one tag is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({ title, description, tags });
      // Reset form
      setTitle("");
      setDescription("");
      setTags([]);
      setNewTag("");
      setErrors({});
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setTags([]);
    setNewTag("");
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Plus className="h-4 w-4 text-blue-600" />
            </div>
            Ask a Question
          </DialogTitle>
          <DialogDescription>
            Get help from the community by asking a clear, specific question with relevant details.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., How to implement JWT authentication in React?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={errors.title ? "border-red-300 focus:border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title}</p>
            )}
            <p className="text-xs text-gray-500">
              Be specific and imagine you're asking a question to another person
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description <span className="text-red-500">*</span>
            </Label>
            
            {/* Formatting Toolbar */}
            <div className="flex gap-2 p-2 bg-gray-50 rounded-t-md border border-b-0">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleFormatting('bold')}
                className="h-8 w-8 p-0 text-gray-700"
                title="Bold (**text**)"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleFormatting('italic')}
                className="h-8 w-8 p-0 text-gray-700"
                title="Italic (*text*)"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleFormatting('bullet')}
                className="h-8 w-8 p-0 text-gray-700"
                title="Bullet List"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleFormatting('numbered')}
                className="h-8 w-8 p-0 text-gray-700"
                title="Numbered List"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleFormatting('link')}
                className="h-8 w-8 p-0 text-gray-700"
                title="Link [text](url)"
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
            </div>
            
            <Textarea
              id="description"
              placeholder="Provide more details about your question. Include what you've tried and what specific help you need.

Use **bold** for emphasis, *italic* for emphasis, and:
- Bullet points for lists
1. Numbered lists for steps
[links](url) for references"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`min-h-[200px] rounded-t-none ${errors.description ? "border-red-300 focus:border-red-500" : ""}`}
              style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace' }}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description}</p>
            )}
            <p className="text-xs text-gray-500">
              Include all the information someone would need to answer your question
            </p>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Tags <span className="text-red-500">*</span>
            </Label>
            
            {/* Selected Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map(tag => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>

            {/* Add Custom Tag */}
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag (e.g., react, javascript)"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag(newTag);
                  }
                }}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => handleAddTag(newTag)}
                disabled={!newTag || tags.includes(newTag) || tags.length >= 5}
              >
                Add
              </Button>
            </div>

            {/* Suggested Tags */}
            <div className="space-y-2">
              <p className="text-xs text-gray-600">Suggested tags:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedTags.filter(tag => !tags.includes(tag)).slice(0, 8).map(tag => (
                  <Button
                    key={tag}
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddTag(tag)}
                    disabled={tags.length >= 5}
                    className="text-xs h-7"
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>

            {errors.tags && (
              <p className="text-sm text-red-600">{errors.tags}</p>
            )}
            <p className="text-xs text-gray-500">
              Add up to 5 tags to describe what your question is about
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button onClick={handleSubmit} className="flex-1 bg-blue-600 hover:bg-blue-700">
            Post Your Question
          </Button>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AskQuestionModal;
