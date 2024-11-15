import { client } from "@/lib/db";
import Link from "next/link";

const getBooks = async () => {
  const result = await client.zRangeWithScores("books", 0, -1);

  // Result
  // [
  //   { value: 'The lazy boy', score: 9388 },
  //   { value: 'sdasdasd', score: 66561 },
  //   { value: 'adfasd', score: 80093 },
  //   { value: 'The final empire', score: 82801 }
  // ]

  const books = await Promise.all(
    result.map((b) => {
      return client.hGetAll(`books:${b.score}`);
    })
  );
  return books;
};

export default async function Home() {
  const books = await getBooks();

  return (
    <main>
      <nav className="flex justify-between">
        <h1 className="font-bold">Books on Redis!</h1>
        <Link href="/create" className="btn">
          Add a new book
        </Link>
      </nav>

      {books.map((book) => (
        <div key={book.title} className="card">
          <h2>{book.title}</h2>
          <p>{book.author}</p>
          <p>{book.rating}</p>
          <p>{book.blurb}</p>
        </div>
      ))}
    </main>
  );
}
