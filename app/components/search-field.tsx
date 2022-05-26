import React, { FC } from 'react';

export const SearchField: FC = () => {
  return (
    <form className="relative mb-2 flex items-center text-sky-400">
      <input
        type="text"
        name="search"
        id="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Zoeken..."
        className="text-md w-full rounded-lg border border-slate-300 py-1 pl-2 pr-10 placeholder-sky-400 focus:ring-0"
      />
      {search ? (
        <button
          onClick={(e) => {
            e.preventDefault();
            setSearch('');
          }}
          className="text-bold absolute right-2 h-6 w-6 rounded-full bg-slate-300 text-white"
        >
          <i className="fas fa-times"></i>
        </button>
      ) : (
        <i className="fas fa-magnifying-glass absolute right-3 text-lg text-slate-400"></i>
      )}
    </form>
  );
};
