import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Download, TrendingUp, AlertCircle, DollarSign, Clock, CheckCircle2 } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  cityName: string;
  aiPredictions: any;
  stats: any;
  reportData: any;
}

export function ReportModal({ isOpen, onClose, cityName, aiPredictions, stats, reportData }: ReportModalProps) {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col p-0">
        {/* Header - Fixed */}
        <div className="px-8 pt-8 pb-4 border-b">
          <div className="flex items-start justify-between mb-2">
            <div>
              <DialogTitle className="text-2xl font-bold mb-1">Weekly Predictive Insights</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {cityName} • {currentDate}
              </DialogDescription>
            </div>
            <Button 
              size="sm"
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-8 py-6 space-y-8 custom-scrollbar">
          {/* Executive Summary */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-purple-600" />
              Executive Summary
            </h3>
            <div className="p-4 rounded-lg bg-purple-50">
              <p className="text-sm text-gray-700 leading-relaxed">
                This AI-powered report analyzes {reportData.totalIssues} civic issues reported in {cityName}. 
                Our predictive models indicate a {reportData.trendDirection} in overall issue volume, with 
                Infrastructure showing the highest predicted increase. Total community engagement stands at{' '}
                {reportData.totalEndorsements} endorsements, demonstrating strong civic participation.
              </p>
            </div>
          </div>

          {/* Key Metrics */}
          <div>
            <h3 className="font-semibold mb-4">Key Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-lg border-2 bg-gradient-to-br from-blue-50 to-white hover:border-blue-300 transition-all">
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Total Issues</p>
                <p className="text-4xl font-bold text-blue-600">{reportData.totalIssues}</p>
              </div>
              <div className="p-6 rounded-lg border-2 bg-gradient-to-br from-purple-50 to-white hover:border-purple-300 transition-all">
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Avg. Endorsements</p>
                <p className="text-4xl font-bold text-purple-600">{reportData.avgEndorsements}</p>
              </div>
              <div className="p-6 rounded-lg border-2 bg-gradient-to-br from-green-50 to-white hover:border-green-300 transition-all">
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Budget Impact</p>
                <p className="text-4xl font-bold text-green-600">{reportData.budgetImpact}</p>
              </div>
              <div className="p-6 rounded-lg border-2 bg-gradient-to-br from-orange-50 to-white hover:border-orange-300 transition-all">
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Avg. Resolution</p>
                <p className="text-4xl font-bold text-orange-600">{reportData.avgResolution}</p>
              </div>
            </div>
          </div>

          {/* Trend Forecasting */}
          <div>
            <h3 className="font-semibold mb-4">Trend Forecasting</h3>
            <div className="space-y-4">
              {reportData.trends.map((trend: any, index: number) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{trend.category}</span>
                      <Badge className={trend.isIncrease ? 'bg-red-100 text-red-600 border-0' : 'bg-green-100 text-green-600 border-0'}>
                        {trend.change}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Confidence</p>
                      <p className="text-xl font-bold text-purple-600">{trend.confidence}%</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{trend.insight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Budget Analysis */}
          <div>
            <h3 className="font-semibold mb-4">Budget Impact Analysis</h3>
            <div className="space-y-4">
              {reportData.budgetBreakdown.map((item: any, index: number) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{item.category}</span>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="text-xs">
                        {item.issues} issues
                      </Badge>
                      <span className="font-bold text-amber-600 text-lg">{item.cost}</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          <div>
            <h3 className="font-semibold mb-4">AI Recommendations</h3>
            <div className="space-y-3">
              {reportData.recommendations.map((rec: string, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-white">{index + 1}</span>
                  </div>
                  <p className="text-sm text-gray-700">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
              This report was generated using AI-powered analytics. Predictions are based on historical data, 
              seasonal patterns, and current trends. For questions or detailed analysis, contact your CiviLink administrator.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}