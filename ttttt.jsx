'use client';

import InfiniteScroll from 'react-infinite-scroll-component';
import { QuoteCard } from '@/app/quotes/components/quote-card';
import { CurrentQuoteCard, QuoteList } from '../components/types';
import { useEffect, useState } from 'react';

export default function QuotesPage() {

  // quote 렌더링
  // 즐겨찾기
  // 즐겨찾기 된거를 로컬 스토리지 저장
  // 즐겨찾기 페이지에는 즐겨찾기 된 것만

  const [quotes, setQuotes] = useState<CurrentQuoteCard[]>([]);
  const [skip, setSkip] = useState(0); // page ..? 가 없는거 같아서 skip이 있길래 해당 방법으로 처리, 30개씩
  const [hasMore, setHasMore] = useState(true);
  const [favorites, setFavorites] = useState<CurrentQuoteCard[]>([]);

  const fetchQuotes = async (skip: number): Promise<QuoteList> => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/quotes?skip=${skip}`
    );
    if (!res.ok) {throw new Error('Failed to fetch quotes');}
    return await res.json();
  };

  // 조회 관련
  const loadMoreQuotes = async () => {
    try {
      const newQuotes = await fetchQuotes(skip);

      const { quotes } = newQuotes;
      setSkip((prevSkip) => prevSkip + 30);
      setHasMore(newQuotes.quotes.length > 0);
      setQuotes((prevQuotes) => [...prevQuotes, ...quotes]);

    } catch (error) {

      setHasMore(false);
    }
  };

  // 즐겨찾기 별표 클릭
  const handleFavoriteClick = (quote: CurrentQuoteCard) => {

    // const exstingData = favorites.find(v => v.id === quote.id);

    // if (exstingData) {
    //   setFavorites(prev => prev.filter(v => v.id !== quote.id));
    // } else {

      setQuotes(prev => prev.map((v => {
        if (v.id === quote.id) {
          return {...v, isFavorite: !v.isFavorite};
        } else {
          return v;
        }
      })));
    // localStorage.setItem('favoriteQuotes', JSON.stringify(updatedFavorites))
    // favoriteCheck(quote, isAlreadyFavorite)
  };

  useEffect(() => {
    // setFavorites(prev => prev.filter(v => v.isFavorite));

    const item = quotes.filter(v => v.isFavorite);

    if (item) {

      setFavorites(quotes.filter(v => v.isFavorite));
    }

  }, [quotes]);

  useEffect(() => {
    localStorage.setItem('favoriteQuotes', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favoriteQuotes');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    loadMoreQuotes();
  }, []);




  return (
    <InfiniteScroll
      dataLength={quotes.length}
      next={loadMoreQuotes} // 다음 페이지 로드
      hasMore={hasMore} // 추가 데이터가 있는지
      loader={<h4>Loading...</h4>}
      endMessage={<p>No more quotes to load</p>}
    >
      {quotes.map((quote) => (
        // key={quote.id}
        <QuoteCard
          key={`list-${quote.id}`}
          quote={quote.quote}
          author={quote.author}
          isFavorite={quote.isFavorite || false}
          onFavorite={() => {
            handleFavoriteClick(quote);
          }}
        />
      ))}
    </InfiniteScroll>
  );
}
