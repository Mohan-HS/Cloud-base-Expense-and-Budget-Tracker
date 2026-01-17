type Props = {
    title: string;
    children: React.ReactNode;
  };
  
  export default function AuthCard({ title, children }: Props) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="w-full max-w-md border border-gray-700 rounded-lg p-6">
          <h1 className="text-2xl font-semibold mb-6 text-center">
            {title}
          </h1>
          {children}
        </div>
      </div>
    );
  }
  