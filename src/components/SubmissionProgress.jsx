import { CheckCircle, Loader, Circle } from 'lucide-react';

export function SubmissionProgress({ steps, currentStep }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Creating Your Project
      </h3>
      
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isPending = index > currentStep;
          
          return (
            <div key={step.id} className="flex items-start gap-4">
              {/* Icon */}
              <div className="shrink-0 mt-0.5">
                {isCompleted && (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                )}
                {isCurrent && (
                  <Loader className="w-6 h-6 text-blue-600 animate-spin" />
                )}
                {isPending && (
                  <Circle className="w-6 h-6 text-gray-300" />
                )}
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <p className={`text-sm font-semibold ${
                  isCompleted ? 'text-green-900' :
                  isCurrent ? 'text-blue-900' :
                  'text-gray-400'
                }`}>
                  {step.title}
                </p>
                <p className={`text-xs mt-1 ${
                  isCompleted ? 'text-green-700' :
                  isCurrent ? 'text-blue-700' :
                  'text-gray-400'
                }`}>
                  {step.description}
                </p>
                
                {/* Additional info for completed steps */}
                {isCompleted && step.result && (
                  <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
                    <p className="text-xs font-mono text-green-800">
                      {step.result}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Status badge */}
              <div className="shrink-0">
                {isCompleted && (
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                    Done
                  </span>
                )}
                {isCurrent && (
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                    In Progress
                  </span>
                )}
                {isPending && (
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded-full font-medium">
                    Pending
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-600">Progress</span>
          <span className="text-xs font-semibold text-gray-900">
            {Math.round((currentStep / steps.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default SubmissionProgress;
