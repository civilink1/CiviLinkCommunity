import { useState } from 'react';
import { Sparkles, CheckCircle, Upload, Loader2, FileText, PlusCircle } from 'lucide-react';
import { categories, mockPosts } from '../../lib/mockData';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../layout/AppLayout';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface CreatePostPageProps {
  currentUser: any;
  onLogout: () => void;
}

export function CreatePostPage({ currentUser, onLogout }: CreatePostPageProps) {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    city: currentUser?.city || '',
    location: '',
    images: [] as File[]
  });

  const [editPrompt, setEditPrompt] = useState('');

  // Simulate AI description generation
  const handleGenerateDescription = async () => {
    if (!formData.title || !formData.category) {
      toast.error('Please enter a title and select a category first');
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const generatedDescriptions: Record<string, string> = {
      'Maintenance': `This maintenance issue regarding ${formData.title.toLowerCase()} needs attention from the HOA maintenance team. The affected area impacts resident comfort and property value. Prompt repair would benefit all community members.`,
      'Landscaping': `The landscaping concern of ${formData.title.toLowerCase()} affects the appearance and property values within the community. The landscaping committee should evaluate this to maintain our neighborhood standards.`,
      'Amenities': `This amenity issue concerning ${formData.title.toLowerCase()} impacts resident access to shared facilities. Prompt resolution would ensure all homeowners can enjoy the community amenities they help fund.`,
      'Safety': `The safety concern regarding ${formData.title.toLowerCase()} requires urgent attention. This issue affects the security and well-being of residents. Swift action would help ensure a safe environment for all community members.`,
      'Noise': `This noise complaint about ${formData.title.toLowerCase()} is affecting residents' quality of life. The HOA board should address this per community noise guidelines to maintain peaceful living conditions.`,
      'Parking': `The parking issue of ${formData.title.toLowerCase()} is impacting residents and visitors. This matter should be resolved in accordance with the community parking policy.`,
      'Rules Violation': `This potential rules violation regarding ${formData.title.toLowerCase()} needs board review. Consistent enforcement of community guidelines helps maintain property values and neighborhood harmony.`,
      'Other': `This issue regarding ${formData.title.toLowerCase()} has been reported for board review. Addressing this matter would improve community satisfaction and quality of life for residents.`
    };

    const description = generatedDescriptions[formData.category] || 
      `This neighborhood issue regarding ${formData.title.toLowerCase()} requires attention from the HOA board. Addressing this matter would improve community services and quality of life for residents.`;


    setFormData({ ...formData, description });
    setIsGenerating(false);
    toast.success('Description generated successfully!');
  };

  // Simulate AI post verification
  const handleVerifyPost = async () => {
    if (!formData.title || !formData.description) {
      toast.error('Please fill in title and description first');
      return;
    }

    setIsVerifying(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock AI verification
    const isLegitimate = !formData.title.toLowerCase().includes('spam') && 
                        !formData.description.toLowerCase().includes('advertisement');

    const result = {
      isLegitimate,
      confidence: isLegitimate ? 0.92 : 0.15,
      reasoning: isLegitimate 
        ? 'This appears to be a legitimate neighborhood issue. The content is relevant to community maintenance and shared spaces.'
        : 'This content may not be a legitimate neighborhood issue. Please ensure your report relates to actual HOA or community concerns.',
      suggestions: isLegitimate
        ? ['Consider adding the specific location within the community', 'Include when the issue was first noticed', 'Add photos if possible']
        : ['Focus on genuine neighborhood concerns', 'Avoid promotional content', 'Ensure the issue affects the community']
    };

    setVerificationResult(result);
    setIsVerifying(false);
  };

  // Simulate AI content editing
  const handleEditWithAI = async () => {
    if (!editPrompt) {
      toast.error('Please enter an editing instruction');
      return;
    }

    setIsEditing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    let newDescription = formData.description;

    if (editPrompt.toLowerCase().includes('formal')) {
      newDescription = `Subject: ${formData.title}\n\nDear HOA Board,\n\nI am writing to bring to your attention a neighborhood concern. ${formData.description}\n\nThis issue requires prompt evaluation and resolution to ensure the continued comfort and safety of our community members.\n\nThank you for your attention to this matter.\n\nRespectfully,\n${currentUser.name}`;
    } else if (editPrompt.toLowerCase().includes('detail')) {
      newDescription = `${formData.description}\n\nAdditional Context:\n- Issue first observed: Recently\n- Affected residents: Nearby homeowners\n- Impact severity: Moderate to High\n- Suggested timeline for resolution: Within 30 days\n- Related area: ${formData.category}`;
    } else if (editPrompt.toLowerCase().includes('brief') || editPrompt.toLowerCase().includes('short')) {
      const sentences = formData.description.split('. ');
      newDescription = sentences.slice(0, 2).join('. ') + '.';
    } else {
      newDescription = formData.description + '\n\nNote: This content has been reviewed and enhanced for clarity and completeness.';
    }

    setFormData({ ...formData, description: newDescription });
    setEditPrompt('');
    setIsEditing(false);
    toast.success('Content updated with AI!');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + formData.images.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    setFormData({ ...formData, images: [...formData.images, ...files] });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.category || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Simulate AI content moderation
    const isLegitPost = Math.random() > 0.2; // 80% pass moderation
    const aiStatus = isLegitPost ? 'pending' : 'rejected';

    // Create new report
    const newPost = {
      id: String(mockPosts.length + 1),
      title: formData.title,
      description: formData.description,
      category: formData.category,
      city: formData.city || 'Sunset Ridge',
      location: formData.location,
      authorId: currentUser.id,
      authorName: currentUser.name,
      author: currentUser.name,
      status: aiStatus,
      endorsements: 0,
      comments: 0,
      commentsCount: 0,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
      images: []
    };

    mockPosts.push(newPost);
    
    if (aiStatus !== 'rejected') {
      toast.success('Report submitted! It will be reviewed by the board.');
    } else {
      toast.error('Report not published. AI flagged it as potentially spam or off-topic.');
    }
    
    navigate('/posts');
  };

  return (
    <AppLayout currentUser={currentUser} onLogout={onLogout}>
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#004080] via-[#003366] to-[#002952] border-b border-white/10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-40"></div>
          <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 relative">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1 w-12 bg-[#E31E24] rounded-full"></div>
                <span className="text-white/80 text-sm tracking-wider uppercase">Report an Issue</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl mb-4 text-white">
                New Report
              </h1>
              <p className="text-lg md:text-xl text-white/70 max-w-2xl">
                Report a neighborhood issue with AI-powered assistance
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <Card className="border-2 hover:border-[#004080]/30 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-[#004080]/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-[#004080]" />
                  </div>
                  <div>
                    <CardTitle>Post Title</CardTitle>
                    <CardDescription>Briefly describe the issue</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="e.g., Pool heater not working, Sprinkler leak near Lot 42"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="text-base"
                />
              </CardContent>
            </Card>

            {/* Category */}
            <Card className="border-2 hover:border-[#004080]/30 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-[#004080]/10 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-[#004080]" />
                  </div>
                  <div>
                    <CardTitle>Category</CardTitle>
                    <CardDescription>Select the relevant department</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Description with AI */}
            <Card className="border-2 hover:border-[#004080]/30 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-[#E31E24]/10 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-[#E31E24]" />
                  </div>
                  <div>
                    <CardTitle>Description</CardTitle>
                    <CardDescription>Provide details about the issue with AI assistance</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGenerateDescription}
                    disabled={isGenerating}
                    className="border-[#004080]/30 hover:bg-[#004080]/10 hover:border-[#004080]"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate with AI
                      </>
                    )}
                  </Button>
                </div>

                <Textarea
                  placeholder="Describe the issue in detail..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                  required
                  className="text-base"
                />

                {/* AI Edit */}
                <div className="space-y-2">
                  <Label>Edit with AI</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., Make it more formal, Add more details, Make it brief"
                      value={editPrompt}
                      onChange={(e) => setEditPrompt(e.target.value)}
                    />
                    <Button
                      type="button"
                      onClick={handleEditWithAI}
                      disabled={isEditing}
                      className="bg-[#E31E24] hover:bg-[#C01A1F] text-white shrink-0"
                    >
                      {isEditing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Verification Result */}
                {verificationResult && (
                  <div className={`p-4 rounded-lg border-2 ${verificationResult.isLegitimate ? 'bg-green-50 dark:bg-green-950/20 border-green-200' : 'bg-red-50 dark:bg-red-950/20 border-red-200'}`}>
                    <div className="flex items-start gap-2 mb-2">
                      <CheckCircle className={`h-5 w-5 ${verificationResult.isLegitimate ? 'text-green-600' : 'text-red-600'}`} />
                      <div className="flex-1">
                        <p className={`${verificationResult.isLegitimate ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'}`}>
                          <strong>AI Verification:</strong> {verificationResult.reasoning}
                        </p>
                        <p className="text-sm mt-2">
                          <strong>Confidence:</strong> {(verificationResult.confidence * 100).toFixed(0)}%
                        </p>
                        {verificationResult.suggestions.length > 0 && (
                          <div className="mt-2">
                            <strong className="text-sm">Suggestions:</strong>
                            <ul className="list-disc list-inside text-sm mt-1">
                              {verificationResult.suggestions.map((suggestion: string, idx: number) => (
                                <li key={idx}>{suggestion}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="border-2 hover:border-[#004080]/30 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-[#004080]/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-[#004080]" />
                  </div>
                  <div>
                    <CardTitle>Location</CardTitle>
                    <CardDescription>Where is this issue located?</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>City</Label>
                  <Input
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Specific Location</Label>
                  <Input
                    placeholder="e.g., Near clubhouse, Pool area, Lot 42"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Image Upload */}
            <Card className="border-2 hover:border-[#004080]/30 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-[#004080]/10 flex items-center justify-center">
                    <Upload className="h-5 w-5 text-[#004080]" />
                  </div>
                  <div>
                    <CardTitle>Images (Optional)</CardTitle>
                    <CardDescription>Upload up to 5 images</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Label
                    htmlFor="image-upload"
                    className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    Choose Images
                  </Label>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <span className="text-sm text-muted-foreground">
                    {formData.images.length} / 5 images selected
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex gap-4">
              <Button 
                type="submit" 
                className="w-full bg-[#004080] hover:bg-[#003366] text-white border-0 transition-all duration-200 hover:shadow-lg hover:shadow-[#004080]/30"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Submit Report
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}