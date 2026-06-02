import React, { useState, useEffect } from 'react';
import { FiFilter } from 'react-icons/fi';
import { MentorCard, MentorCardSkeleton } from '../../components/MentorCard';
import { SearchBar, FilterPanel } from '../../components/SearchAndFilter';
import { mockMentors } from '../../data/mockData';
import { mentorService, BACKEND_URL } from '../../services';

const mapMentorData = (m) => {
  let imageUrl = m.photoUrl;
  if (imageUrl && !imageUrl.startsWith('http')) {
    imageUrl = BACKEND_URL + imageUrl;
  }
  return {
    id: m.id,
    name: m.name,
    role: m.domain || 'Mentor',
    company: m.company || 'Tech Expert',
    image: imageUrl || null,
    skills: m.skills || [],
    experience: m.yearsOfExperience || 0,
    rating: m.rating || 5.0,
    reviews: m.reviewCount || 0,
    sessionFee: m.sessionPrice || 0,
    about: m.bio || '',
    availability: m.expertise || ['Mon', 'Wed', 'Fri'],
    badge: m.rating >= 4.8 ? 'Top Mentor' : 'Verified'
  };
};

const MentorListing = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [mentorsList, setMentorsList] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const mentorsPerPage = 6;

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await mentorService.getAll();
        const mapped = response.data.map(mapMentorData);
        setMentorsList(mapped);
        setFilteredMentors(mapped);
      } catch (error) {
        console.error('Failed to fetch mentors from API', error);
        setMentorsList(mockMentors);
        setFilteredMentors(mockMentors);
      } finally {
        setLoading(false);
      }
    };
    fetchMentors();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    filterMentors(term, {});
  };

  const handleFilter = (filters) => {
    filterMentors(searchTerm, filters);
  };

  const filterMentors = (search, filters) => {
    let result = mentorsList.filter((mentor) => {
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesSearch =
          mentor.name.toLowerCase().includes(searchLower) ||
          mentor.role.toLowerCase().includes(searchLower) ||
          mentor.company.toLowerCase().includes(searchLower) ||
          mentor.skills.some((skill) => skill.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      if (filters.examCategories && filters.examCategories.length > 0) {
        const matchesCategory = mentor.skills.some((skill) =>
          filters.examCategories.some((cat) => skill.toLowerCase().includes(cat.toLowerCase()))
        );
        if (!matchesCategory) return false;
      }

      if (filters.experience && filters.experience.length > 0) {
        const matchesExperience = filters.experience.some((exp) => {
          if (exp === '0-2') return mentor.experience <= 2;
          if (exp === '2-5') return mentor.experience > 2 && mentor.experience <= 5;
          if (exp === '5-10') return mentor.experience > 5 && mentor.experience <= 10;
          if (exp === '10+') return mentor.experience > 10;
          return true;
        });
        if (!matchesExperience) return false;
      }

      if (filters.priceRange) {
        const [min, max] = filters.priceRange;
        if (mentor.sessionFee < min || mentor.sessionFee > max) return false;
      }

      if (filters.rating && mentor.rating < filters.rating) return false;

      return true;
    });

    setFilteredMentors(result);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredMentors.length / mentorsPerPage);
  const startIdx = (currentPage - 1) * mentorsPerPage;
  const paginatedMentors = filteredMentors.slice(startIdx, startIdx + mentorsPerPage);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 page-enter">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-ink-900 mb-1">Find a mentor</h1>
        <p className="text-sm text-ink-600">
          {filteredMentors.length} mentor{filteredMentors.length !== 1 ? 's' : ''} available
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <SearchBar onSearch={handleSearch} placeholder="Search by name, role, skills..." />
      </div>

      {/* Mobile filter toggle */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center gap-2 px-3 py-2 text-sm text-ink-700 bg-white border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors"
        >
          <FiFilter size={14} />
          Filters
        </button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters */}
        <div>
          <FilterPanel onFilter={handleFilter} isOpen={isFilterOpen} setIsOpen={setIsFilterOpen} />
        </div>

        {/* Mentors */}
        <div className="md:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <MentorCardSkeleton key={i} />
              ))}
            </div>
          ) : paginatedMentors.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {paginatedMentors.map((mentor) => (
                  <MentorCard key={mentor.id} mentor={mentor} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-brand-600 text-white'
                          : 'text-ink-600 hover:bg-surface-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-3xl mb-3">🔍</p>
              <h3 className="text-base font-semibold text-ink-800 mb-1">No mentors found</h3>
              <p className="text-sm text-ink-600">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorListing;
