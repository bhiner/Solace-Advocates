"use client";

import { useEffect, useState } from "react";
import { IAdvocate } from "@/models/models";

export default function Home() {
  const [advocates, setAdvocates] = useState<IAdvocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<IAdvocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedSpecialties, setExpandedSpecialties] = useState<{[key: number]: boolean}>({});

  useEffect(() => {
    console.log("fetching advocates...");
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
    });
  }, []);

  const onSearchTextChange = (e) => {
    const searchTerm = e.target.value;

    setSearchTerm(searchTerm);

    document.getElementById("search-term").innerHTML = searchTerm;

    console.log("filtering advocates...");
      const lowerSearchTerm = searchTerm.toLowerCase();
      const filteredAdvocates = advocates.filter((advocate) => {
        return (
          advocate.firstName.toLowerCase().includes(lowerSearchTerm) ||
          advocate.lastName.toLowerCase().includes(lowerSearchTerm) ||
          advocate.city.toLowerCase().includes(lowerSearchTerm) ||
          advocate.degree.toLowerCase().includes(lowerSearchTerm) ||
          advocate.specialties.some((s: string) => s.toLowerCase().includes(lowerSearchTerm)) ||
          advocate.yearsOfExperience == searchTerm
        );
      });

    setFilteredAdvocates(filteredAdvocates);
  };

  const handleResetClick = () => {
    console.log(advocates);
    setFilteredAdvocates(advocates);

    setSearchTerm("");
    document.getElementById("search-term").innerHTML = '';
    setExpandedSpecialties({});
  };

  const formatPhoneNumber = (phone: string): string => {
    const cleaned = ('' + phone).replace(/\D/g, '');
    if (cleaned.length === 10) {
      const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
      }
    }
    return phone;
  }

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-green-800">Solace Advocates</h1>
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <p className="font-semibold mb-2">Search</p>
          <p className="mb-4 text-gray-600">
            Searching for: <span id="search-term" className="font-mono text-blue-600"></span>
          </p>
          <div className="flex gap-4">
            <input
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={onSearchTextChange}
              placeholder="Type to search..."
              value={searchTerm}
            />
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800 transition"
              onClick={handleResetClick}
            >
              Reset Search
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-gray-300">
                <th className="py-2 px-4 text-left font-semibold">First Name</th>
                <th className="py-2 px-4 text-left font-semibold">Last Name</th>
                <th className="min-w-40 py-2 px-4 text-left font-semibold">City</th>
                <th className="py-2 px-4 text-left font-semibold">Degree</th>
                <th className="py-2 px-4 text-left font-semibold">Specialties</th>
                <th className="py-2 px-4 text-left font-semibold">Years of Experience</th>
                <th className="min-w-40 py-2 px-4 text-left font-semibold">Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdvocates.map((advocate, idx) => {
                const isExpanded = expandedSpecialties[idx];
                return (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="py-2 px-4">{advocate.firstName}</td>
                    <td className="py-2 px-4">{advocate.lastName}</td>
                    <td className="py-2 px-4">{advocate.city}</td>
                    <td className="py-2 px-4">{advocate.degree}</td>
                    <td className="py-2 px-4">
                      {(isExpanded ? advocate.specialties : advocate.specialties.slice(0, 3)).map((s: string, i: number) => (
                        <span key={i} className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded mr-1 mb-1 text-xs">
                          {s}
                        </span>
                      ))}
                      {advocate.specialties.length > 3 && !isExpanded && (
                        <button
                          className="inline-block bg-gray-200 text-gray-600 px-2 py-1 rounded mr-1 mb-1 text-xs cursor-pointer hover:bg-gray-300"
                          onClick={() => setExpandedSpecialties(prev => ({ ...prev, [idx]: true }))}
                          aria-label="Show all specialties"
                        >Show More</button>
                      )}
                      {advocate.specialties.length > 3 && isExpanded && (
                        <button
                          className="inline-block bg-gray-200 text-gray-600 px-2 py-1 rounded mr-1 mb-1 text-xs cursor-pointer hover:bg-gray-300"
                          onClick={() => setExpandedSpecialties(prev => ({ ...prev, [idx]: false }))}
                          aria-label="Show less specialties"
                        >Show less</button>
                      )}
                    </td>
                    <td className="py-2 px-4">{advocate.yearsOfExperience}</td>
                    <td className="py-2 px-4">{formatPhoneNumber(advocate.phoneNumber)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
