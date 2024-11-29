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
    <div className="w-full min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-7xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">
              Customer Data
            </h2>
            <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-6">
              <div className="relative w-full sm:w-72">
                <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                <TextInput
                  id="table-search"
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={searchChange}
                  className="pl-10 w-full rounded-md border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  sizing="md"
                />
              </div>
              <Select
                id="age-filter"
                value={ageFilter}
                onChange={handleAgeFilterChange}
                className="w-full sm:w-56 rounded-md border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              >
                <option value="">All Ages</option>
                <option value="0-18">0-18</option>
                <option value="19-30">19-30</option>
                <option value="31-50">31-50</option>
                <option value="51+">51+</option>
              </Select>
            </div>
          </div>

          {/* Table Section */}
          <div className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            {isLoading ? (
              <div className="min-w-full">
                <Table>
                  <Table.Head>
                    <Table.HeadCell className="text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Sl. No.
                    </Table.HeadCell>
                    <Table.HeadCell className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Name
                    </Table.HeadCell>
                    <Table.HeadCell className="text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Date of Birth
                    </Table.HeadCell>
                    <Table.HeadCell className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Email
                    </Table.HeadCell>
                    <Table.HeadCell className="text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Phone Number
                    </Table.HeadCell>
                  </Table.Head>
                  <Table.Body>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Table.Row key={index}>
                        <Table.Cell className="text-center">
                          <Skeleton />
                        </Table.Cell>
                        <Table.Cell>
                          <Skeleton />
                        </Table.Cell>
                        <Table.Cell className="text-center">
                          <Skeleton />
                        </Table.Cell>
                        <Table.Cell>
                          <Skeleton />
                        </Table.Cell>
                        <Table.Cell className="text-center">
                          <Skeleton />
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>
            ) : isError ? (
              <div className="flex justify-center items-center p-8">
                <p className="text-gray-500 dark:text-gray-400">
                  Failed to fetch data. Please try again.
                </p>
              </div>
            ) : tableData && tableData.length > 0 ? (
              <div className="min-w-full">
                <Table>
                  <Table.Head>
                    <Table.HeadCell className="text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Sl. No.
                    </Table.HeadCell>
                    <Table.HeadCell className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Name
                    </Table.HeadCell>
                    <Table.HeadCell className="text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Date of Birth
                    </Table.HeadCell>
                    <Table.HeadCell className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Email
                    </Table.HeadCell>
                    <Table.HeadCell className="text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Phone Number
                    </Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {tableData.map((item, index) => (
                      <Table.Row key={item.id}>
                        <Table.Cell className="text-center text-sm font-medium text-gray-800 dark:text-gray-100">
                          {index + 1}
                        </Table.Cell>
                        <Table.Cell className="text-sm font-medium text-gray-800 dark:text-gray-100">
                          {item.name}
                        </Table.Cell>
                        <Table.Cell className="text-center text-sm text-gray-600 dark:text-gray-300">
                          {item.dob}
                        </Table.Cell>
                        <Table.Cell className="text-sm text-gray-600 dark:text-gray-300">
                          {item.email}
                        </Table.Cell>
                        <Table.Cell className="text-center text-sm text-gray-600 dark:text-gray-300">
                          {item.phoneNumber}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>
            ) : (
              <div className="flex justify-center items-center p-8">
                <p className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <HiSearch className="w-6 h-6" />
                  No matching results found.
                </p>
              </div>
            )}
          </div>

          {/* Pagination Section */}
          {tableData && tableData.length > 0 && (
            <div className="flex justify-center gap-6 pt-6">
              <button
                onClick={() => handlePagination(currentPageNumber - 1)}
                disabled={currentPageNumber <= 1}
                className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => handlePagination(currentPageNumber + 1)}
                className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Customer;
