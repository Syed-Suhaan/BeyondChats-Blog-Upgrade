import { Link } from 'react-router-dom';

const ArticleCard = ({ article }) => {
    const isEnhanced = article.version === 'enhanced';

    return (
        <Link
            to={`/article/${article.id}`}
            className="group relative flex flex-col bg-gray-800/40 border border-white/10 rounded-2xl overflow-hidden hover:bg-gray-800/60 hover:border-purple-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1 h-full backdrop-blur-sm"
        >
            <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${isEnhanced ? 'bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.2)]' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                        {isEnhanced ? '✦ Enhanced' : 'Original'}
                    </span>
                    <span className="text-gray-500 text-xs font-mono">
                        {new Date(article.publishedAt).toLocaleDateString()}
                    </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-purple-300 transition-colors">
                    {article.title}
                </h3>

                <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed flex-1">
                    {article.slug.replace(/-/g, ' ')}...
                </p>

                <div className="flex items-center text-sm font-medium text-gray-500 group-hover:text-white transition-colors mt-auto pt-4 border-t border-white/5">
                    Read Analysis <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </div>
            </div>
        </Link>
    );
};

export default ArticleCard;
