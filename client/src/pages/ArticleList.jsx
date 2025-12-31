import { useEffect, useState } from 'react';
import { getArticles } from '../api/articles.api';
import ArticleCard from '../components/ArticleCard';
import Navbar from '../components/Navbar';

const ArticleList = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await getArticles();
                // Sort: Enhanced first, then by date
                const sorted = data.sort((a, b) => {
                    if (a.version === 'enhanced' && b.version !== 'enhanced') return -1;
                    if (a.version !== 'enhanced' && b.version === 'enhanced') return 1;
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });
                setArticles(sorted);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-purple-500/30">
            <Navbar />

            <div className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="mb-16 text-center space-y-4">
                    <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-b from-white via-gray-200 to-gray-500 bg-clip-text text-transparent pb-2">
                        Content Upgrade Dashboard
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        Review original blog posts and their AI-enhanced versions powered by market research and Llama-3.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="relative">
                            <div className="h-16 w-16 rounded-full border-t-2 border-b-2 border-purple-500 animate-spin"></div>
                            <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map((article) => (
                            <ArticleCard key={article.id} article={article} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArticleList;
