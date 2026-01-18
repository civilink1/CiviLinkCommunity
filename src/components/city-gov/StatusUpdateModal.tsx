import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { POST_STATUSES } from '../../config/constants';
import { Badge } from '../ui/badge';
import { CheckCircle2, XCircle, Clock, TrendingUp, Sparkles } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

interface StatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: any;
  currentStatus: string;
  onUpdateStatus: (postId: string, newStatus: string, note: string) => void;
}

export function StatusUpdateModal({ isOpen, onClose, post, currentStatus, onUpdateStatus }: StatusUpdateModalProps) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus || 'pending');
  const [note, setNote] = useState('');

  /**
   * TODO - Backend Integration: GET /api/ai/completion-prediction
   * Calculate AI-powered completion time predictions based on:
   * - Issue category and complexity
   * - Historical data for similar issues
   * - Current department workload
   * - Resource availability
   * Parameters: { postId, category, priority, newStatus }
   */
  const getCompletionPrediction = (status: string, category: string) => {
    // Mock AI predictions - replace with real API call
    const predictions: Record<string, any> = {
      'in-progress': {
        estimatedDays: 12,
        confidence: 85,
        factors: [
          { label: 'Similar issues avg', value: '10-14 days' },
          { label: 'Current workload', value: 'Moderate' },
          { label: 'Resource availability', value: 'Good' }
        ]
      },
      'under-review': {
        estimatedDays: 3,
        confidence: 92,
        factors: [
          { label: 'Review process avg', value: '2-4 days' },
          { label: 'Documentation status', value: 'Complete' },
          { label: 'Priority level', value: 'High' }
        ]
      },
      'resolved': {
        estimatedDays: 0,
        confidence: 100,
        factors: []
      },
      'pending': {
        estimatedDays: 18,
        confidence: 78,
        factors: [
          { label: 'Queue position', value: '#12' },
          { label: 'Category backlog', value: '15 issues' },
          { label: 'Seasonal impact', value: 'Winter delays' }
        ]
      }
    };

    return predictions[status] || predictions['pending'];
  };

  const prediction = getCompletionPrediction(selectedStatus, post?.category || '');

  // Update selectedStatus when currentStatus changes
  useEffect(() => {
    if (currentStatus) {
      setSelectedStatus(currentStatus);
    }
  }, [currentStatus]);

  const handleSubmit = () => {
    if (!note.trim()) {
      alert('Please provide a note explaining the status change');
      return;
    }
    onUpdateStatus(post.id, selectedStatus, note);
    setNote('');
    onClose();
  };

  const currentStatusObj = POST_STATUSES.find(s => s.value === currentStatus);
  const selectedStatusObj = POST_STATUSES.find(s => s.value === selectedStatus);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Update Issue Status</DialogTitle>
          <DialogDescription className="text-base">
            Change the status of this civic issue and provide details for the citizen
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Status */}
          <div>
            <Label className="text-base mb-2 block">Current Status</Label>
            <div className="flex items-center gap-2">
              <Badge className={`${currentStatusObj?.color} border-0 text-base px-4 py-2`}>
                {currentStatusObj?.label}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {currentStatusObj?.description}
              </span>
            </div>
          </div>

          {/* New Status */}
          <div>
            <Label htmlFor="status" className="text-base mb-2 block">
              New Status <span className="text-red-500">*</span>
            </Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger id="status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {POST_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    <div className="flex items-center gap-2">
                      <Badge className={`${status.color} border-0`}>
                        {status.label}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        - {status.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedStatusObj && selectedStatus !== currentStatus && (
              <div className="mt-2 p-3 rounded-lg bg-blue-50 border border-blue-200">
                <p className="text-sm text-blue-900">
                  <CheckCircle2 className="h-4 w-4 inline mr-1" />
                  Status will change to: <strong>{selectedStatusObj.label}</strong>
                </p>
              </div>
            )}
          </div>

          {/* Note */}
          <div>
            <Label htmlFor="note" className="text-base mb-2 block">
              Status Update Note <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-muted-foreground mb-2">
              Explain the status change to the citizen and all users who endorsed this issue. 
              Be clear and specific about next steps or reasons for the decision.
            </p>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Example: Issue validated. Repair crew has been scheduled for January 15, 2026. Materials have been ordered and work should be completed within 2 days."
              rows={5}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {note.length} / 500 characters
            </p>
          </div>

          {/* Warning for rejected/closed */}
          {(selectedStatus === 'rejected' || selectedStatus === 'closed') && selectedStatus !== currentStatus && (
            <div className="p-4 rounded-lg bg-red-50 border-2 border-red-200">
              <div className="flex items-start gap-2">
                <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900 mb-1">
                    {selectedStatus === 'rejected' ? 'Issue Rejection' : 'Issue Closure'}
                  </p>
                  <p className="text-sm text-red-800">
                    {selectedStatus === 'rejected' 
                      ? 'Please clearly explain why this issue is being rejected (e.g., duplicate, not valid, outside city jurisdiction).'
                      : 'Please provide a clear explanation of the resolution or reason for closure.'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* AI Completion Prediction */}
          {selectedStatus !== 'resolved' && selectedStatus !== 'rejected' && (
            <Card className="border-2 bg-gradient-to-br from-purple-50 to-blue-50">
              <CardContent className="py-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold flex items-center gap-2">
                      Completion Prediction
                      <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 text-xs">AI</Badge>
                    </h4>
                    <p className="text-xs text-muted-foreground">Based on historical data and current workload</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">{prediction.estimatedDays}</div>
                    <p className="text-xs text-muted-foreground">days</p>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Confidence Level</span>
                    <span className="font-medium">{prediction.confidence}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                      style={{ width: `${prediction.confidence}%` }}
                    ></div>
                  </div>
                </div>

                {prediction.factors.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Key Factors:</p>
                    <div className="grid grid-cols-1 gap-2">
                      {prediction.factors.map((factor: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-white/60 border">
                          <span className="text-xs text-gray-600">{factor.label}</span>
                          <span className="text-xs font-medium text-gray-900">{factor.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="hover:bg-muted"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!note.trim() || selectedStatus === currentStatus}
            className="bg-[#004080] hover:bg-[#003366]"
          >
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}