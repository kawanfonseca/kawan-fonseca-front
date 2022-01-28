import React from 'react'
import './SearchInput.css'

export const SearchInput = ({ valueSearch, onChangeSearch }) => {
  return (
    <div className="col-md-8">
      <div className="input-group mb-3">
        <input
          id="input-search"
          type="text"
          className="form-control border-radius-lg"
          placeholder="Search by title"
          value={valueSearch}
          onChange={(event) => onChangeSearch(event.target.value)}
        />
      </div>
    </div>
  )
}
