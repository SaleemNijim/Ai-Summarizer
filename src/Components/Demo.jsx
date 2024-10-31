import { useState, useEffect } from "react";

import { copy, linkIcon, loader, tick } from "../assets";
import { useLazyGetSummaryQuery } from '../services/article'



const Demo = () => {

    const [article, setArticle] = useState({
        url: '',
        summary: '',
    })
    const [allArticle, setAllArticle] = useState([])
    const [copied, setCopied] = useState('')


    // RTK lazy query
    const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

    // Load data from localStorage on mount
    useEffect(() => {
        const articlesFromLocalStorage = JSON.parse(
            localStorage.getItem("articles")
        );

        if (articlesFromLocalStorage) {
            setAllArticle(articlesFromLocalStorage);
        }
    }, []);

    const handelSubmit = async (e) => {
        e.preventDefault()
        const { data } = await getSummary({ articleUrl: article.url })
        if (data?.summary) {
            const newArticle = { ...article, summary: data.summary }
            const updateAllArticles = [newArticle, ...allArticle]
            // update state and local storage
            setArticle(newArticle)
            setAllArticle(updateAllArticles)
            localStorage.setItem('articles', JSON.stringify(updateAllArticles))
        }
    }
    // copy the url and toggle the icon for user feedback
    const handleCopy = (copyUrl) => {
        setCopied(copyUrl)
        navigator.clipboard.writeText(copyUrl)
        setTimeout(() => {
            setCopied(false)
        }, 3000);
    }

    return (

        <section className="mt-16 w-full max-w-xl">
            {/* Search */}
            <div className="flex flex-col w-full gap-2">
                <form className="flex justify-center items-center relative" onSubmit={handelSubmit}>
                    <img src={linkIcon} alt="Link_Icon" className="absolute left-0 my-2 ml-3 w-5" />
                    <input
                        type="url"
                        placeholder="Enter Your URL"
                        value={article.url}
                        onChange={(e) => setArticle({ ...article, url: e.target.value })}
                        required
                        className="url_input peer-focus:border-gray-700 peer-focus:text-gray-700" />
                    <button
                        type="submit"
                        className="submit_btn">
                        ↵
                    </button>
                </form>
                {/* Browse History */}
                <div className='flex flex-col gap-1 max-h-60 overflow-y-auto'>
                    {allArticle.reverse().map((item, index) => (
                        <div
                            key={`link-${index}`}
                            onClick={() => setArticle(item)}
                            className='link_card'
                        >
                            <div className='copy_btn' onClick={() => handleCopy(item.url)}>
                                <img
                                    src={copied === item.url ? tick : copy}
                                    alt={"copy_icon"}
                                    className='w-[40%] h-[40%] object-contain'
                                />
                            </div>
                            <p className='flex-1 font-satoshi text-blue-700 font-medium text-sm truncate'>
                                {item.url}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            {/* Display Results  */}
            <div className="my-10 max-w-full flex justify-center  items-center">
                {
                    isFetching
                        ? (<img src={loader} alt="loader" className="w-20 h-20 object-contain " />)
                        : error
                            ? <p className="font-inter font-bold text-black text-center">
                                `Well! , that's wasn't supposed to happen...  `<br />
                                <span className="font-satoshi font-normal text-gray-700">
                                    {error?.data?.error}
                                </span>
                            </p>
                            : (
                                article.summary && (
                                    <div className="flex flex-col gap-3">
                                        <h2 className="font-satoshi font-bold text-gray-600 text-xl"> Article <span className='blue_gardient'>Summary</span></h2>

                                        <div className="summary_box">
                                            <p className="font-inter font-medium text-sm text-gr">{article.summary}</p>
                                        </div>
                                    </div>
                                )
                            )
                }
            </div>
        </section>
    )
}

export default Demo
