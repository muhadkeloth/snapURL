import {  ExternalLink, Link2, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { deleteURL, getAllShortenURLs, shortenURL } from '../services/apiCall';
import { getErrorMessage, isValidUrl } from '../utils/functions';
import toast from 'react-hot-toast';
import ConfirmationModal from '../components/ConfirmationModel';
import Pagination from '../components/Pagination'

export interface ShortenedLink {
    _id: string;
    originalUrl: string;
    shortUrl: string;
    clicks: number;
    createdAt: string;
  }

const Home = () => {
    const [url, setUrl] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [links, setLinks] = useState<ShortenedLink[]>([])
    const [isloading, setIsLoading] = useState(false);
    const [isshorting, setIsshorting] = useState(false);
    const [deleteId, setDeleteId] = useState("");
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false)
  
    const handleSubmit = async(e: React.FormEvent) => {
      e.preventDefault();

      const trimmedUrl = url.trim();
      if (!trimmedUrl) {
        toast.error('Please enter a URL')
        return;
      };
      if(!isValidUrl(trimmedUrl)) {
        toast.error('Please enter a valid URL');
        return;
      }
      try {
        setIsshorting(true);
        const response = await shortenURL(trimmedUrl);
      if(response){

        await fetchAllUrls(currentPage)
        setUrl('');
      }
      toast.success('URL shortened successfully!');
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      toast.error(`Failed to shorten URL ${errorMessage} `);
    }finally{
      setIsshorting(false)
    }
    };

    const fetchAllUrls = async (page: number) => {
        try {
          setIsLoading(true);
          const { data } = await getAllShortenURLs(page);
          if (!data || !data.URLs)
            throw new Error("url details not found");
          setLinks(data.URLs);
          setCurrentPage(data.currentPage)
          setTotalPages(data.totalPages);
        } catch (error) {
          const errorMessage = getErrorMessage(error)
          toast.error(`Failed to fetch URL ${errorMessage} `);
        }finally {
          setIsLoading(false);
        }
      };

      const handleUrlDelete = async(id:string) => {
        try {
          const response = await deleteURL(id);
          if(response){
            setLinks(prev => prev.filter(link => link._id !== id));
            toast.success('URL deleted successfully!');
          }
        } catch (error) {
          const errorMessage = getErrorMessage(error)
          toast.error(`Failed to delete URL ${errorMessage} `);
        }finally{
          setShowConfirmModal(false);
          setDeleteId("");
        }
      }

      const handleCopyUrl = (shortUrl: string) => {
        navigator.clipboard.writeText(shortUrl);
        toast.success('URL copied!');
      };


    useEffect(() => {
      fetchAllUrls(currentPage);
    }, [currentPage]);


  return (
    <div className="flex-1 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-4">
              Shorten Your Link
            </h1>
            <p className="text-center mb-8">
              Enter an URL to get a shortened link within secounds.
            </p>

            <form onSubmit={handleSubmit} className="mb-12">
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center"
                >
                  <Link2 className="h-5 w-5 mr-2" />
                  {isshorting ? 'Shorting...' : 'Shorten'}
                </button>
              </div>
            </form>

            
            {links.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">
                  Your Shortened Links
                </h2>
                <div className="bg-gray-50 rounded-lg divide-y divide-gray-200">
                  {links.map((link) => (
                    <div
                      key={link._id}
                      className="p-4 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500 truncate">
                            {link.originalUrl}
                          </p>
                          <div className="flex items-center gap-2">
                            <a
                              href={link.shortUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                            >
                              {link.shortUrl}
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            Created on{" "}
                            {new Date(link.createdAt).toLocaleString('en-GB', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm text-gray-500">
                            {link.clicks.toLocaleString()} clicks
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleCopyUrl(link.shortUrl)}
                              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200"
                            >
                              Copy
                            </button>
                            <button
                              onClick={() => {
                                setShowConfirmModal(true);
                                setDeleteId(link._id)}
                              } 
                              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-red-400"
                            >
                              <Trash2 className="py-1 " />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isloading ? (
              <div className="text-center py-4">Loading...</div>
            ) : (
              <Pagination 
            islength={links.length > 0 && !isloading} 
            currentPage={currentPage} 
            setCurPage={(page)=>{
              setCurrentPage(page)
            }} 
            totalPages={totalPages} />
            )}                       

          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={()=>{
          setShowConfirmModal(false);
          setDeleteId("");
        }}
        onConfirm={()=> handleUrlDelete(deleteId)}
        title='Are you sure you want to confirm delete URL ?'
        />
    </div>
  );
}

export default Home