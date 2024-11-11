import React from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import Button from './Button';

const TableComponent = ({ columns, data, tableName, isButton, height, onClick }) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize }
    } = useTable({ columns, data, initialState: { pageIndex: 0 } },
        useSortBy,
        usePagination
    );

    const tableHeight = height ? `${parseInt(height) - 120}px` : 'auto';

    return (
        <div>
            <div className='bottom-card' style={{ height: height || 'auto' }} >
                <div className='card-content mb-2'>
                    <div className='card-header'>{tableName} </div>
                    {isButton ? <div>
                        <Button style="small"
                            onClick={onClick}
                        >
                            Add Spaces
                        </Button>
                    </div>
                        : ""}
                </div>
                <div className='overflow-auto' style={{ height: tableHeight }}>
                    <table {...getTableProps()} border="1" cellPadding="10" cellSpacing="0" id="studentList" className="table">
                        <thead className='table-head'>
                            {
                                headerGroups.map((headerGroup) => (
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                        {
                                            headerGroup.headers.map((column) => (
                                                <th className='border text-left bg-orange-400 p-2 text-base font-semibold' {...column.getHeaderProps(column.getSortByToggleProps())}
                                                    style={{ cursor: 'pointer' }}>
                                                    {column.render('Header')}
                                                    <span>
                                                        {column.isSorted
                                                            ? column.isSortedDesc
                                                                ? ' 🔽'
                                                                : ' 🔼'
                                                            : ''}
                                                    </span>
                                                </th>
                                            ))
                                        }
                                    </tr>
                                ))
                            }
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {page.map((row) => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()}>
                                        {row.cells.map((cell) => (
                                            <td className='border p-2 text-base' {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className='pagination-wrapper mt-2'>
                    <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                        {'<<'}
                    </button>
                    <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                        {'<'}
                    </button>
                    <button onClick={() => nextPage()} disabled={!canNextPage}>
                        {'>'}
                    </button>
                    <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                        {'>>'}
                    </button>
                    <span>
                        Page{' '}
                        <strong>
                            {pageIndex + 1} of {pageOptions.length}
                        </strong>{' '}
                    </span>
                    <span>
                        | Go to page:{' '}
                        <input
                            type="number"
                            defaultValue={pageIndex + 1}
                            onChange={(e) => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                                gotoPage(page);
                            }}
                            style={{ width: '50px' }}
                        />
                    </span>
                    <select
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                    >
                        {[10, 20, 30, 40, 50].map((size) => (
                            <option key={size} value={size}>
                                Show {size}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    )
}

export default TableComponent;