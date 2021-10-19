import {  useState } from 'react'

import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

interface HeadCell {
  id: string
  label: string
}

export default function useTable(headCells: HeadCell[]) {
  const pages = [5, 10, 25]
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(pages[page])
  
  interface TableProps {
    children: React.ReactNode
  }

  const TblContainer = (props) => {
    return (
      <table className="w-full whitespace-nowrap">
        {props.children}
      </table>
    )
  }

  const TblHead = (props: any) => {
    return (
      <thead>
        <tr className="h-16 w-full text-sm leading-none text-gray-800">
          { headCells.map((headCell) => (
            <th className="font-normal text-left pl-20" key={headCell.id}>{headCell.label}</th>
          ))}
        </tr>
      </thead>
    )
  }

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }
  const getPageNumber = () => {
      if (pageCount < 4) {
        return [...Array(pageCount + 1).keys()].slice(1)
      } else if (pageCount <= 4) {
        return [1, 2, 3, 4, 5]
      } else if (currentPage > pageCount - 4) {
        return [...Array(5).keys()].reverse()
          .map(v => pageCount - v)
      } else {
        return [currentPage - 1, currentPage, currentPage + 1]
      }
    }

  const TblPagination = (onNavigate) => {

    return (
      <tfoot>
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <a
            href="#"
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Previous
          </a>
          <a
            href="#"
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Next
          </a>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
              <span className="font-medium">97</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <a
                href="#"
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Previous</span>
                <FiChevronLeft />
              </a>
              <a
                href="#"
                aria-current="page"
                className="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
              >
                1
              </a>
              <a
                href="#"
                className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
              >
                2
              </a>
              <a
                href="#"
                className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hidden md:inline-flex relative items-center px-4 py-2 border text-sm font-medium"
              >
                3
              </a>
              <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                ...
              </span>
              <a
                href="#"
                className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hidden md:inline-flex relative items-center px-4 py-2 border text-sm font-medium"
              >
                8
              </a>
              <a
                href="#"
                className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
              >
                9
              </a>
              <a
                href="#"
                className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
              >
                10
              </a>
              <a
                href="#"
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Next</span>
                <FiChevronRight />
              </a>
            </nav>
          </div>
        </div>
      </div>
    </tfoot>
    )
  }

  // const recordsAfterPagingAndSorting = () => {
  //   return stableSort(filterFn.fn(records), getComparator(order, orderBy)).slice(page * rowsPerPage, (page + 1) * rowsPerPage)
  // }

  return {
    TblContainer,
    TblHead,
    TblPagination
  }
}