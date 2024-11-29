/* eslint-disable react-hooks/exhaustive-deps */
// file for the customer portal

// importing the required modules
import React, { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import { Table, TextInput, Card, Select } from "flowbite-react";
import axios from "axios";
import { HiSearch } from "react-icons/hi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface DataItem {
  id: number;
  name: string;
  dob: string;
  email: string;
  phoneNumber: string;
}

const Customer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tableData, setTableData] = useState<DataItem[] | null>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [ageFilter, setAgeFilter] = useState("");

  useEffect(() => {
    fetchData();
  }, [searchTerm, ageFilter]);

  useEffect(() => {
    console.log("isLoading:", isLoading);
  }, [isLoading]);

  // initial rendering
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:4000/customer`, {
        params: {
          search: searchTerm,
          age: ageFilter,
          page: currentPageNumber,
        },
      });
      if (response.status === 200) {
        setTableData(response.data.data);
        setIsError(false);
      }
    } catch (error) {
      setIsError(true);
      console.error("Error while fetching data", error);
    } finally {
      setIsLoading(false);
    }
  };

  // for the search purpose
  const fetchSearchData = useCallback(
    debounce(async (query: string) => {
      setCurrentPageNumber(1);
      if (query.trim() === "" && !ageFilter) {
        fetchData();
        return;
      }
      try {
        setIsLoading(true);
        setIsError(false);
        const response = await axios.get(`http://localhost:4000/customer`, {
          params: {
            search: query,
            age: ageFilter,
            page: 1,
          },
        });
        if (response.status === 200) {
          setTableData(response.data.data);
        }
      } catch (error) {
        console.error("error", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }, 1000),
    [ageFilter]
  );

  const searchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchSearchData(value);
  };

  // for handling the pagination
  const handlePagination = async (pageNumber: number) => {
    if (pageNumber < 1) return;
    setCurrentPageNumber(pageNumber);
    try {
      const response = await axios.get(`http://localhost:4000/customer`, {
        params: {
          page: pageNumber,
          search: searchTerm,
          age: ageFilter,
        },
      });
      if (response.status === 200) {
        setTableData(response.data.data);
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  const handleAgeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAgeFilter(e.target.value);
    setCurrentPageNumber(1);
  };

  return (
    <Card className="max-w-7xl mx-auto mt-8 p-6 shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Customer Data
        </h2>
        <div className="flex flex-wrap gap-4 items-center w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
            <TextInput
              id="table-search"
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={searchChange}
              className="pl-10 w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <Select
            id="age-filter"
            value={ageFilter}
            onChange={handleAgeFilterChange}
            className="w-full sm:w-56 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Ages</option>
            <option value="0-18">0-18</option>
            <option value="19-30">19-30</option>
            <option value="31-50">31-50</option>
            <option value="51+">51+</option>
          </Select>
        </div>
      </div>
      <div className="relative overflow-x-auto rounded-lg shadow-md">
        {isLoading ? (
          <div className="py-10">
            <Table className="min-w-full text-sm text-gray-700 dark:text-gray-300">
              <Table.Head>
                <Table.HeadCell className="text-center px-4 py-2">
                  Sl. No.
                </Table.HeadCell>
                <Table.HeadCell>Name</Table.HeadCell>
                <Table.HeadCell className="text-center px-4 py-2">
                  Date of Birth
                </Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell className="text-center px-4 py-2">
                  Phone Number
                </Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Table.Row
                    key={index}
                    className="bg-white dark:bg-gray-800 dark:border-gray-700"
                  >
                    <Table.Cell className="text-center px-4 py-2">
                      <Skeleton />
                    </Table.Cell>
                    <Table.Cell>
                      <Skeleton />
                    </Table.Cell>
                    <Table.Cell className="text-center px-4 py-2">
                      <Skeleton />
                    </Table.Cell>
                    <Table.Cell>
                      <Skeleton />
                    </Table.Cell>
                    <Table.Cell className="text-center px-4 py-2">
                      <Skeleton />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        ) : isError ? (
          <div className="flex justify-center items-center py-10">
            <p className="text-gray-500 dark:text-gray-400">
              Failed to fetch data. Please try again.
            </p>
          </div>
        ) : tableData && tableData.length > 0 ? (
          <Table className="min-w-full text-sm text-gray-700 dark:text-gray-300">
            <Table.Head>
              <Table.HeadCell className="text-center px-4 py-2">
                Sl. No.
              </Table.HeadCell>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell className="text-center px-4 py-2">
                Date of Birth
              </Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell className="text-center px-4 py-2">
                Phone Number
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {tableData.map((item, index) => (
                <Table.Row
                  key={item.id}
                  className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700"
                >
                  <Table.Cell className="text-center px-4 py-2 font-medium text-gray-900 dark:text-white">
                    {index + 1}
                  </Table.Cell>
                  <Table.Cell className="px-4 py-2">{item.name}</Table.Cell>
                  <Table.Cell className="text-center px-4 py-2">
                    {item.dob}
                  </Table.Cell>
                  <Table.Cell className="px-4 py-2">{item.email}</Table.Cell>
                  <Table.Cell className="text-center px-4 py-2">
                    {item.phoneNumber}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        ) : (
          <div className="flex justify-center items-center py-10">
            <p className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <HiSearch className="w-6 h-6" />
              No matching results found.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {tableData && tableData.length > 0 && (
        <div className="flex flex-wrap gap-4 mt-6 justify-center items-center">
          <button
            onClick={() => handlePagination(currentPageNumber - 1)}
            disabled={currentPageNumber <= 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>
          <button
            onClick={() => handlePagination(currentPageNumber + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded transition hover:bg-blue-600"
          >
            Next
          </button>
        </div>
      )}
    </Card>
  );
};

export default Customer;
