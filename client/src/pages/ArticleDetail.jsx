import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getArticleById, getArticleComparison, enhanceArticle } from '../api/articles.api';
import Navbar from '../components/Navbar';

const ArticleDetail = () => {
    const { id } = useParams();
    const [originalArticle, setOriginalArticle] = useState(null);
    const [comparisonData, setComparisonData] = useState(null);
    const [loadingOriginal, setLoadingOriginal] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                // 1. Fetch Original Immediately to show something
                const current = await getArticleById(id);
                setOriginalArticle(current);
                setLoadingOriginal(false); // Stop blocking UI here

                if (current && current.slug) {
                    // 2. Fetch Comparison (Async) - Background
                    const comparison = await getArticleComparison(current.slug);

                    if (!comparison.enhanced) {
                        // Comparison loaded, but no enhanced version yet.
                        // Set data so "Enhanced" panel shows "Enhancing..."
                        setComparisonData(comparison);

                        // Trigger generation
                        try {
                            console.log("Triggering auto-enhance...");
                            const newEnhanced = await enhanceArticle(current.id);
                            // Update state once AI is done
                            setComparisonData(prev => ({ ...prev, enhanced: newEnhanced }));
                        } catch (e) {
                            console.error("Auto-enhance failed", e);
                        }
                    } else {
                        // Enhanced version exists, show it immediately
                        setComparisonData(comparison);
                    }
                }
            } catch (err) {
                console.error(err);
                setLoadingOriginal(false);
            }
        };
        fetch();
    }, [id]);

    if (loadingOriginal) return <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 text-center">Loading article...</div>;

    // Use data from comparison if available, otherwise fallback to the initially fetched original
    const original = comparisonData?.original || originalArticle;
    const enhanced = comparisonData?.enhanced;

    // Helper to clean scraped garbage (remove footer share icons/text)
    const cleanContent = (html) => {
        if (!html) return '';
        let cleaned = html.replace(/(?:For more such amazing content|follow us here)[\s\S]*$/i, '');
        cleaned = cleaned.replace(/Share this:[\s\S]*$/i, '');

        return cleaned;
    };

    const cleanOriginalContent = original ? cleanContent(original.content) : '';

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans overflow-x-hidden">
            <Navbar />

            <div className="pt-24 pb-8 px-4 flex items-center justify-between max-w-[1600px] mx-auto w-full">
                <Link to="/" className="text-gray-500 hover:text-white inline-flex items-center transition-colors text-sm font-medium">
                    <span className="mr-2">←</span> Back to Dashboard
                </Link>
                <div className="text-center">
                    <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        Content Transformation
                    </h1>
                    <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest">Side-by-Side Comparison</p>
                </div>
                <div className="w-24"></div> {/* Spacer for centering */}
            </div>

            <div className="px-4 pb-12 w-full max-w-[1800px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:divide-x divide-white/10 border border-white/10 rounded-3xl overflow-hidden bg-gray-900/20 backdrop-blur-sm shadow-2xl">

                    {/* ORIGINAL COLUMN */}
                    <div className="p-8 md:p-12 bg-black/20 relative group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-50"></div>
                        <div className="mb-8 flex items-center justify-between sticky top-24 z-10 bg-[#0a0a0a] border border-b-white/10 p-4 -mx-4 rounded-xl shadow-xl">
                            <span className="px-3 py-1 rounded-full text-xs font-bold border border-blue-500/30 text-blue-400 bg-blue-500/10 tracking-wide">
                                ORIGINAL VERSION
                            </span>
                            <span className="text-xs text-gray-500 font-mono">
                                {original ? new Date(original.publishedAt).toLocaleDateString() : 'N/A'}
                            </span>
                        </div>

                        {original ? (
                            <div className="prose prose-invert prose-sm md:prose-base max-w-none text-gray-400 opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                                {/* Added !important margins to force separation */}
                                <h2 className="text-white font-bold !mt-12 !mb-10 pb-2 !leading-normal text-3xl">{original.title}</h2>
                                <div dangerouslySetInnerHTML={{ __html: cleanOriginalContent }} />
                            </div>
                        ) : (
                            <div className="text-gray-500 italic text-center py-20">Original version not available.</div>
                        )}
                    </div>

                    {/* ENHANCED COLUMN */}
                    <div className="p-8 md:p-12 bg-gradient-to-b from-purple-900/5 to-transparent relative group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
                        <div className="mb-8 flex items-center justify-between sticky top-24 z-10 bg-[#0a0a0a] border border-b-white/10 p-4 -mx-4 rounded-xl shadow-xl">
                            <span className="px-3 py-1 rounded-full text-xs font-bold border border-purple-500/50 text-purple-300 bg-purple-500/20 tracking-wide shadow-[0_0_10px_rgba(168,85,247,0.3)] flex items-center gap-2">
                                <span>✦</span> ENHANCED VERSION
                            </span>
                            <span className="text-xs text-purple-400/60 font-mono">
                                AI OPTIMIZED
                            </span>
                        </div>

                        {enhanced ? (
                            <div className="prose prose-invert prose-sm md:prose-base max-w-none text-gray-200 leading-relaxed">
                                <h2 className="text-transparent bg-clip-text bg-gradient-to-br from-white to-purple-200 font-extrabold !mt-12 !mb-10 pb-2 !leading-normal text-3xl">
                                    {enhanced.title}
                                </h2>
                                <div dangerouslySetInnerHTML={{ __html: enhanced.content }} />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center h-full">
                                <div className="p-6 rounded-full bg-purple-500/10 mb-6 animate-pulse">
                                    <span className="text-4xl animate-bounce block">✨</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Enhancing with AI...</h3>
                                <p className="text-gray-400 max-w-sm mx-auto">
                                    Our backend is currently researching and rewriting this article.
                                    <br /><br />
                                    <span className="text-sm text-purple-400">Please wait, this may take 10-20 seconds.</span>
                                </p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ArticleDetail;
