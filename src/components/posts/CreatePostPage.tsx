import { Sparkles, CheckCircle, Upload, Loader2, FileText } from 'lucide-react';
import { categories, mockPosts } from '../../lib/mockData';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

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
      'Infrastructure': `This ${formData.title.toLowerCase()} represents a critical infrastructure issue that requires immediate attention. The affected area poses potential safety risks to residents and impacts daily community activities. Proper assessment and repair by the ${formData.category} department would significantly improve public safety and quality of life in ${formData.city}.`,
      'Transportation': `The transportation issue of ${formData.title.toLowerCase()} is affecting commuters and residents in the ${formData.location || 'area'}. This matter requires coordination with the Transportation Department to ensure safe and efficient mobility. Addressing this concern would enhance the overall transportation infrastructure and improve daily commutes for citizens.`,
      'Parks': `This parks and recreation matter concerning ${formData.title.toLowerCase()} impacts community wellness and outdoor activities. The Parks Department should evaluate and address this issue to maintain our community's recreational spaces. Improvements would benefit families, children, and all residents who utilize these public spaces.`,
      'Public Safety': `The public safety concern regarding ${formData.title.toLowerCase()} requires urgent attention from local authorities. This issue affects the security and well-being of residents in ${formData.city}. Swift action by the Public Safety Department would help ensure a secure environment for all community members.`,
      'Education': `This educational facility issue of ${formData.title.toLowerCase()} impacts students, teachers, and families in our community. The Education Department should prioritize addressing this concern to maintain a safe and productive learning environment. Resolving this matter would contribute to better educational outcomes for our children.`,
      'Health': `The public health matter of ${formData.title.toLowerCase()} affects community wellness and requires attention from health officials. This issue impacts residents' access to health services and overall well-being in ${formData.city}. Proper resolution would enhance public health infrastructure and services.`
    };

    const description = generatedDescriptions[formData.category] || 
      `This civic issue regarding ${formData.title.toLowerCase()} requires attention from the appropriate city department. Addressing this matter would improve community services and quality of life for residents in ${formData.city}.`;

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
        ? 'This appears to be a legitimate civic issue. The content is relevant to community infrastructure and public services. The description provides specific details about location and impact.'
        : 'This content may not be a legitimate civic issue. Please ensure your post relates to actual community infrastructure, safety, or public service concerns.',
      suggestions: isLegitimate
        ? ['Consider adding specific location details', 'Include timeframe for when the issue started', 'Add any relevant images if available']
        : ['Focus on genuine civic issues', 'Avoid promotional content', 'Ensure the issue affects the community']
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
      newDescription = `Subject: ${formData.title}\n\nDear City Officials,\n\nI am writing to bring to your attention a matter of civic concern. ${formData.description}\n\nThis issue requires prompt evaluation and resolution to ensure the continued safety and well-being of our community members.\n\nThank you for your attention to this matter.\n\nRespectfully,\n${currentUser.name}`;
    } else if (editPrompt.toLowerCase().includes('detail')) {
      newDescription = `${formData.description}\n\nAdditional Context:\n- Issue first observed: Recently\n- Affected population: Local residents and commuters\n- Impact severity: Moderate to High\n- Suggested timeline for resolution: Within 30 days\n- Related city services: ${formData.category} Department`;
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

    if (!formData.title || !formData.description || !formData.category || !formData.city || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Simulate AI verification
    const isLegitPost = Math.random() > 0.2; // 80% chance of being legit, 20% flagged as spam
    const aiStatus = isLegitPost ? 'approved' : 'under-review';

    // Create new post
    const newPost = {
      id: String(mockPosts.length + 1),
      title: formData.title,
      description: formData.description,
      category: formData.category,
      city: formData.city,
      location: formData.location,
      authorId: currentUser.id,
      authorName: currentUser.name,
      status: aiStatus,
      endorsements: 0,
      commentsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      images: []
    };

    mockPosts.push(newPost);
    
    if (aiStatus === 'approved') {
      toast.success('Post created and verified successfully!');
    } else {
      toast.info('Post created and sent for admin review');
    }
    
    navigate('/posts');
  };

  return (
    <AppLayout currentUser={currentUser} onLogout={onLogout}>
      <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl mb-2">Create New Post</h1>
          <p className="text-muted-foreground">
            Report a civic issue with AI-powered assistance
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <Card>
            <CardHeader>
              <CardTitle>Post Title</CardTitle>
              <CardDescription>Briefly describe the issue</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="e.g., Pothole on Main Street needs repair"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </CardContent>
          </Card>

          {/* Category */}
          <Card>
            <CardHeader>
              <CardTitle>Category</CardTitle>
              <CardDescription>Select the relevant department</CardDescription>
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
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
              <CardDescription>Provide details about the issue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGenerateDescription}
                  disabled={isGenerating}
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleVerifyPost}
                  disabled={isVerifying}
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Verify with AI
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
                <div className={`p-4 rounded-lg ${verificationResult.isLegitimate ? 'bg-green-50 dark:bg-green-950/20' : 'bg-red-50 dark:bg-red-950/20'}`}>
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
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
              <CardDescription>Where is this issue located?</CardDescription>
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
                  placeholder="e.g., Main Street & 5th Avenue"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Images (Optional)</CardTitle>
              <CardDescription>Upload up to 5 images</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Label
                  htmlFor="image-upload"
                  className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
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
            <Button type="submit" className="flex-1">
              <FileText className="h-4 w-4 mr-2" />
              Submit Post
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/posts')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}