
'use client';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export default function HelpButton({ onClick }) {
    return (
        <button
            className="fixed bottom-6 right-6 flex items-center justify-center px-6 py-3 
                       bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-bold 
                       rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all 
                       duration-300 ease-in-out focus:outline-none focus:ring-4 
                       focus:ring-purple-400 focus:ring-offset-2"
            onClick={onClick}
        >
            <HelpOutlineIcon className="mr-2 text-2xl text-white" />
            Ask Bot
        </button>
    );
}
