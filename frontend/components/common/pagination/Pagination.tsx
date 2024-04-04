'use client';

import { useState } from 'react';

import ReactPaginate from 'react-paginate';

import styles from './Pagination.module.scss';

interface Articles {
  id: number;
  title: string;
  comment: string;
  author: string;
  imageLink: string;
}

interface Props {
  articles: Articles[];
  // totalCount: number;
  totalPages: number;
  // currentPage: number;
}

export default function Pagination({ articles, totalPages }: Props) {
  const [itemOffset, setItemOffset] = useState(0);

  const endOffset = itemOffset + 20;
  console.log(`Loading items from ${itemOffset} to ${endOffset}`);

  const handlePageClick = (e: { selected: number }) => {
    if (articles) {
      const newOffset = (e.selected * 20) % articles.length;
      setItemOffset(newOffset);
    }
  };

  return (
    <div>
      <ReactPaginate
        breakLabel="..."
        previousLabel="<"
        nextLabel=">"
        pageRangeDisplayed={2}
        marginPagesDisplayed={1}
        pageCount={totalPages}
        onPageChange={handlePageClick}
        containerClassName={styles.pagination}
        pageClassName={styles['pagination-page']}
        previousClassName={styles['pagination-prev']}
        nextClassName={styles['pagination-next']}
        previousLinkClassName={styles['pagination-link']}
        nextLinkClassName={styles['pagination-link']}
        activeClassName={styles['pagination-link-active']}
      />
    </div>
  );
}
