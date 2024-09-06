import React, { useState, useMemo } from 'react';
import { usePeopleQuery } from './query';
import { Modal, Button } from 'react-daisyui';
import './people.css';
import { Person } from './model';
import { v4 as uuidv4 } from 'uuid';

export function People() {
  const { data: people = [], loading, error } = usePeopleQuery();
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [filter, setFilter] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPerson, setNewPerson] = useState<Omit<Person, 'id'>>({} as Person);

  // Sorting
  const sortedPeople = useMemo(() => {
    const sorted = [...people].sort((a, b) => {
      const key = sortConfig.key as keyof Person;
      if (a[key] < b[key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    return sorted;
  }, [people, sortConfig]);

  // Filtering
  const filteredPeople = useMemo(() => {
    return sortedPeople.filter(person => 
      person.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [sortedPeople, filter]);

  // Pagination
  const totalItems = filteredPeople.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPeople = filteredPeople.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleSort = (key: string) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.direction === 'ascending' ? 'descending' : 'ascending'
    }));
  };

  const handleFilterChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setFilter(e.target.value);
  };

  const handleItemsPerPageChange = (e: { target: { value: string; }; }) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  const handlePageChange = (page: React.SetStateAction<number>) => {
    setCurrentPage(page);
  };

  const handleAddPerson = async (person: Omit<Person, 'id'>) => {
    try {
      // print the object to be saved for adding a person
      console.log(person);
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const movieTitles = formData.get('titles') as string;
    const releaseDates = formData.get('dates') as string;
    
    const movies = movieTitles.split(',').map((title, index) => ({
      title: title.trim(),
      released: (releaseDates.split(',')[index] || '').trim(),
    }));

    const person = {
      id: uuidv4(),
      name: formData.get('name') as string,
      show: formData.get('show') as string,
      actor: formData.get('actor') as string,
      dob: formData.get('dob') as string,
      movies: movies,
      updatedAt: new Date().toISOString(),
    };
    handleAddPerson(person);
    setNewPerson({} as Person);
  };

  if (loading) {
    return <p>Fetching People...</p>;
  }

  if (error) {
    return <h2>Oops! looks like something went wrong!</h2>;
  }

  if (totalItems === 0) {
    return <p>No People Available.</p>;
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-end">
        <Button onClick={handleModalOpen}>Add Person</Button>
      </div>
      <Modal open={isModalOpen} onClose={handleModalClose}>
        <Modal.Header className="flex justify-between">
          <button type="button" className="text-gray-400 hover:text-gray-500" onClick={handleModalClose}>
            close
          </button>
        </Modal.Header>
        <Modal.Header>Add Person</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleModalSubmit}>
            <label>
              Name:
              <input type="text" name="name" value={newPerson.name} onChange={e => setNewPerson({ ...newPerson, name: e.target.value })} />
            </label>
            <label>
              Show:
              <input type="text" name="show" value={newPerson.show} onChange={e => setNewPerson({ ...newPerson, show: e.target.value })} />
            </label>
            <label>
              Actor/Actress:
              <input type="text" name="actor" value={newPerson.actor} onChange={e => setNewPerson({ ...newPerson, actor: e.target.value })} />
            </label>
            <label>
              Date of birth:
              <input type="date" name="dob" value={newPerson.dob} onChange={e => setNewPerson({ ...newPerson, dob: e.target.value })} />
            </label>
            <label>
              Movie Titles (comma-separated):
              <input type="text" name="titles" placeholder="e.g. Movie 1, Movie 2" />
            </label>
            <label>
              Release Dates (comma-separated):
              <input type="text" name="dates" placeholder="e.g. 2024-01-01, 2024-06-15" />
            </label>
            <Button type="submit">Add Person</Button>
          </form>
        </Modal.Body>
      </Modal>
      <input
        type="text"
        aria-label="Search"
        placeholder="Search"
        value={filter}
        onChange={handleFilterChange}
      />
      <select aria-label="Items per page" value={itemsPerPage} onChange={handleItemsPerPageChange}>
        <option value={10}>10</option>
        <option value={15}>15</option>
        <option value={20}>20</option>
      </select>
      <table>
        <thead>
          <tr>
            <th
              role="columnheader"
              aria-sort={sortConfig.key === 'name' ? sortConfig.direction as 'ascending' | 'descending' | 'none' : 'none'}
              onClick={() => handleSort('name')}
            >
              Name {sortConfig.key === 'name' && <svg fill="#000000" height="16px" width="16px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 490 490" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <polygon points="85.877,154.014 85.877,428.309 131.706,428.309 131.706,154.014 180.497,221.213 217.584,194.27 108.792,44.46 0,194.27 37.087,221.213 "></polygon> <polygon points="404.13,335.988 404.13,61.691 358.301,61.691 358.301,335.99 309.503,268.787 272.416,295.73 381.216,445.54 490,295.715 452.913,268.802 "></polygon> </g> </g></svg>}
            </th>
            <th>Show</th>
            <th>Actor/Actress</th>
            <th>Date of birth</th>
            <th>Movies</th>
          </tr>
        </thead>
        <tbody>
          {paginatedPeople.map((person, index) => (
            <tr key={index}>
              <td>{person.name}</td>
              <td>{person.show}</td>
              <td>{person.actor}</td>
              <td>{person.dob}</td>
              <td>{person.movies.map(movie => movie.title).join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          First
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Showing {(startIndex + 1)}-{Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          Last
        </button>
      </div>
    </div>
  );
}
