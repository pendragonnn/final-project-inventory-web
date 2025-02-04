import { Package } from "lucide-react";

const Loader = () => {
	return (
		<div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
			<div className="flex flex-col items-center space-y-6">
				{/* Animated Icon */}
				<div className="relative flex items-center justify-center">
					<div className="absolute h-20 w-20 animate-ping rounded-full bg-primary opacity-30"></div>
					<div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
					<Package size={48} className="absolute text-primary" />
				</div>
				{/* Text */}
			</div>
		</div>
	);
};

export default Loader;
