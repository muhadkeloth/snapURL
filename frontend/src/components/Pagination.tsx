import { ArrowLeft, ArrowRight } from 'lucide-react'

interface PaginationProps {
    islength:boolean;
    currentPage:number;
    setCurPage:(page:number) => void;
    totalPages:number;
}


const Pagination = ({
    islength, currentPage, setCurPage, totalPages
}:PaginationProps) => {

    if(!islength){
        return <p className="flex justify-center">No links created yet. Start creating some!</p>
    } 
  return (
        <div className="flex justify-center items-center mt-4">
          <button
            disabled={currentPage === 1}
            className=" disabled:bg-gray-200 p-1 rounded-lg hover:opacity-70 cursor-pointer"
            onClick={() => setCurPage(Math.max(currentPage - 1, 1))}
          >
            <ArrowLeft />
          </button>
          <span className="text-sm mx-2 text-gray-600">
            {" "}
            Page {currentPage} of {totalPages}{" "}
          </span>
          <button
            disabled={currentPage === totalPages}
            className="cursor-pointer disabled:bg-gray-200 p-1 rounded-lg hover:opacity-70"
            onClick={() =>
              setCurPage(Math.min(currentPage + 1, totalPages))
            }
          >
            <ArrowRight />
          </button>
        </div>
  )
}

export default Pagination