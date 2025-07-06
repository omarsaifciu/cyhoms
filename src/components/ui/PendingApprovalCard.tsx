import { AlertCircle, Clock } from "lucide-react";
interface PendingApprovalCardProps {
  title: string;
  message: string;
  note: string;
  cannotPublish: string;
}
const PendingApprovalCard: React.FC<PendingApprovalCardProps> = ({
  title,
  message,
  note,
  cannotPublish
}) => {
  return <div className="flex justify-center items-center min-h-[70vh] py-[69px] px-[15px] my-0">
      <div className="w-full max-w-md">
        <div className="rounded-3xl shadow-2xl border-0 bg-white/95 dark:bg-[#232433]/95 backdrop-blur-xl px-8 py-10 flex flex-col items-center transition-all duration-300 hover:shadow-3xl" style={{
        boxShadow: '0 8px 32px 0 rgba(var(--brand-accent-r, 236), var(--brand-accent-g, 72), var(--brand-accent-b, 154), 0.15)',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.90) 100%)'
      }}>
          {/* Animated Icon */}
          <div className="relative mb-6 flex items-center justify-center">
            <span className="absolute -inset-4 rounded-full blur-xl opacity-20 animate-pulse" style={{
            background: 'linear-gradient(135deg, var(--brand-gradient-from-color, hsl(var(--brand-accent-h) var(--brand-accent-s) var(--brand-accent-l))) 0%, var(--brand-gradient-to-color, hsl(var(--brand-accent-h) var(--brand-accent-s) var(--brand-accent-l))) 100%)'
          }} />
            <span className="relative flex items-center justify-center p-6 rounded-full shadow-lg border-2" style={{
            background: 'linear-gradient(135deg, var(--brand-gradient-from-color, hsl(var(--brand-accent-h) var(--brand-accent-s) var(--brand-accent-l))) 0%, var(--brand-gradient-to-color, hsl(var(--brand-accent-h) var(--brand-accent-s) calc(var(--brand-accent-l) - 5%))) 100%)',
            borderColor: 'var(--brand-gradient-from-color, hsl(var(--brand-accent-h) var(--brand-accent-s) var(--brand-accent-l)))'
          }}>
              <Clock className="w-16 h-16 text-white animate-spin-slow" />
            </span>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-extrabold text-center mb-4 tracking-tight bg-gradient-to-r bg-clip-text text-transparent" style={{
          backgroundImage: 'linear-gradient(135deg, var(--brand-gradient-from-color, hsl(var(--brand-accent-h) var(--brand-accent-s) var(--brand-accent-l))) 0%, var(--brand-gradient-to-color, hsl(var(--brand-accent-h) var(--brand-accent-s) calc(var(--brand-accent-l) - 10%))) 100%)'
        }}>
            {title}
          </h2>

          {/* Message */}
          <p className="text-gray-700 dark:text-gray-200 text-base sm:text-lg text-center mb-6 leading-relaxed">
            {message}
          </p>

          {/* Note Box */}
          <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-[#223153] dark:to-[#1e2a4a] p-4 rounded-xl shadow-inner mb-6 border border-blue-100 dark:border-blue-800 animate-fade-in">
            <p className="text-sm text-blue-700 dark:text-blue-200 text-center font-medium">
              {note}
            </p>
          </div>

          {/* Cannot Publish Notice */}
          <div className="flex flex-col items-center gap-3">
            <div className="p-2 rounded-full" style={{
            background: 'linear-gradient(135deg, var(--brand-gradient-from-color, hsl(var(--brand-accent-h) var(--brand-accent-s) var(--brand-accent-l))) 0%, var(--brand-gradient-to-color, hsl(var(--brand-accent-h) var(--brand-accent-s) calc(var(--brand-accent-l) - 5%))) 100%)'
          }}>
              <AlertCircle className="w-6 h-6 text-white animate-bounce" />
            </div>
            <span className="font-semibold text-lg animate-fade-in bg-gradient-to-r bg-clip-text text-transparent" style={{
            backgroundImage: 'linear-gradient(135deg, var(--brand-gradient-from-color, hsl(var(--brand-accent-h) var(--brand-accent-s) var(--brand-accent-l))) 0%, var(--brand-gradient-to-color, hsl(var(--brand-accent-h) var(--brand-accent-s) calc(var(--brand-accent-l) - 5%))) 100%)'
          }}>
              {cannotPublish}
            </span>
          </div>

          {/* Floating Particles Animation */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-2 h-2 rounded-full animate-bounce opacity-60" style={{
            background: 'var(--brand-gradient-from-color, hsl(var(--brand-accent-h) var(--brand-accent-s) var(--brand-accent-l)))'
          }} />
            <div className="absolute bottom-20 right-10 w-1 h-1 rounded-full animate-bounce delay-300 opacity-50" style={{
            background: 'var(--brand-gradient-to-color, hsl(var(--brand-accent-h) var(--brand-accent-s) calc(var(--brand-accent-l) - 5%)))'
          }} />
            <div className="absolute top-1/2 right-8 w-1.5 h-1.5 rounded-full animate-ping delay-700 opacity-40" style={{
            background: 'var(--brand-gradient-from-color, hsl(var(--brand-accent-h) var(--brand-accent-s) var(--brand-accent-l)))'
          }} />
          </div>
        </div>
      </div>
    </div>;
};
export default PendingApprovalCard;