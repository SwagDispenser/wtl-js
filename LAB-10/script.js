const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(null, args);
        }, delay);
    };
};

const parseQueryParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
        search: params.get('search') || '',
        sort: params.get('sort') || 'name-asc',
        minAge: parseInt(params.get('minAge')) || null,
        maxAge: parseInt(params.get('maxAge')) || null,
        gender: params.get('gender') || 'all',
        country: params.get('country') || 'all',
        email: params.get('email') || '',
        tab: params.get('tab') || 'all'
    };
};

const updateQueryParams = (params) => {
    const searchParams = new URLSearchParams();

    if (params.search) searchParams.set('search', params.search);
    if (params.sort && params.sort !== 'name-asc') searchParams.set('sort', params.sort);
    if (params.minAge) searchParams.set('minAge', params.minAge);
    if (params.maxAge) searchParams.set('maxAge', params.maxAge);
    if (params.gender && params.gender !== 'all') searchParams.set('gender', params.gender);
    if (params.country && params.country !== 'all') searchParams.set('country', params.country);
    if (params.email) searchParams.set('email', params.email);
    searchParams.set('tab', params.tab);

    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.pushState({}, '', newUrl);
};

const authContainer = document.getElementById('auth-container');
const mainContainer = document.getElementById('main-container');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const authTabButtons = document.querySelectorAll('.auth-tab-btn');
const authSuccessMessage = document.getElementById('auth-success-message');
const registerCountry = document.getElementById('register-country');
const registerCity = document.getElementById('register-city');
const logoutBtn = document.getElementById('logout-btn');
const currentUserEl = document.getElementById('current-user');
const searchInput = document.getElementById('search-input');
const userCardsContainer = document.getElementById('user-cards-container');
const loadingSpinner = document.getElementById('loading-spinner');
const errorMessage = document.getElementById('error-message');
const pageNumbersContainer = document.getElementById('page-numbers');
const minAgeInput = document.getElementById('min-age');
const maxAgeInput = document.getElementById('max-age');
const genderFilter = document.getElementById('gender-filter');
const countryFilter = document.getElementById('country-filter');
const sortBy = document.getElementById('sort-by');
const emailFilter = document.getElementById('email-filter');

let state = {
    currentUser: null,
    users: [],
    filteredUsers: [],
    favorites: new Set(),
    currentPage: 1,
    itemsPerPage: 20,
    hasMore: true,
    isFetching: false,
    totalPages: 1,
    isLoading: false,
    error: null,
    activeTab: 'all',
    queryParams: parseQueryParams()
};

const initApp = () => {
    state.queryParams = parseQueryParams();
    const user = localStorage.getItem('currentUser');

    if (user) {
        state.currentUser = JSON.parse(user);
        showMainApp();
        loadFavorites();
        fetchUsers();
    } else {
        showAuthForm();
    }

    setupEventListeners();
};

const showAuthForm = () => {
    authContainer.classList.remove('hidden');
    mainContainer.classList.add('hidden');
};

const showMainApp = () => {
    authContainer.classList.add('hidden');
    mainContainer.classList.remove('hidden');
    currentUserEl.textContent = state.currentUser.name;
};

const setupEventListeners = () => {
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);

    authTabButtons.forEach(button => {
        button.addEventListener('click', () => switchAuthTab(button.dataset.authTab));
    });

    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', () => togglePassword(button.dataset.target));
    });

    registerCountry.addEventListener('change', updateRegisterCities);
    logoutBtn.addEventListener('click', handleLogout);

    searchInput.addEventListener('input', debounce(handleSearch, 300));
    minAgeInput.addEventListener('change', handleFilterChange);
    maxAgeInput.addEventListener('change', handleFilterChange);
    genderFilter.addEventListener('change', handleFilterChange);
    countryFilter.addEventListener('change', handleFilterChange);
    emailFilter.addEventListener('input', debounce(handleEmailFilter, 300));
    sortBy.addEventListener('change', handleSortChange);

    document.querySelectorAll('main .tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    window.addEventListener('scroll', handleScroll);

    window.addEventListener('popstate', () => {
        state.queryParams = parseQueryParams();
        applyFiltersAndRender();
    });
};

const citiesByCountry = {
    Ukraine: ['Kyiv', 'Lviv', 'Kharkiv', 'Chernivtsi', 'Dnipro'],
    Poland: ['Warsaw', 'Krakow', 'Gdansk', 'Wroclaw'],
    Germany: ['Berlin', 'Munich', 'Hamburg', 'Cologne'],
    USA: ['New York', 'Los Angeles', 'Chicago', 'Miami']
};

const switchAuthTab = (tab) => {
    authTabButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.authTab === tab);
    });

    registerForm.classList.toggle('active', tab === 'signup');
    loginForm.classList.toggle('active', tab === 'login');

    clearAuthMessage();
};

const togglePassword = (targetId) => {
    const input = document.getElementById(targetId);
    input.type = input.type === 'password' ? 'text' : 'password';
};

const updateRegisterCities = () => {
    const cities = citiesByCountry[registerCountry.value] || [];

    registerCity.innerHTML = '<option value="">Choose city...</option>';
    registerCity.disabled = cities.length === 0;

    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        registerCity.appendChild(option);
    });

    setFieldState(registerCity, false, '');
};

const showAuthMessage = (message) => {
    authSuccessMessage.textContent = message;
    authSuccessMessage.classList.add('show');
};

const clearAuthMessage = () => {
    authSuccessMessage.textContent = '';
    authSuccessMessage.classList.remove('show');
};

const setFieldState = (field, isValid, message = '') => {
    if (!field) return;

    field.classList.toggle('valid', isValid && field.value.trim() !== '');
    field.classList.toggle('invalid', !isValid && message !== '');

    const group = field.closest('.form-group');
    const error = group ? group.querySelector('.error') : null;

    if (error) {
        error.textContent = message;
    }
};

const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isPhoneValid = (phone) => /^\+380\d{9}$/.test(phone);

const validateLoginForm = () => {
    clearAuthMessage();

    let isValid = true;

    const email = document.getElementById('login-email');
    const password = document.getElementById('login-password');

    if (!isEmailValid(email.value.trim())) {
        setFieldState(email, false, 'Enter a valid email');
        isValid = false;
    } else {
        setFieldState(email, true);
    }

    if (password.value.trim().length < 6) {
        setFieldState(password, false, 'Password must contain at least 6 characters');
        isValid = false;
    } else {
        setFieldState(password, true);
    }

    return isValid;
};

const validateRegisterForm = () => {
    clearAuthMessage();

    let isValid = true;

    const firstName = document.getElementById('register-first-name');
    const lastName = document.getElementById('register-last-name');
    const email = document.getElementById('register-email');
    const password = document.getElementById('register-password');
    const confirmPassword = document.getElementById('register-confirm-password');
    const phone = document.getElementById('register-phone');
    const birthDate = document.getElementById('register-birth-date');
    const selectedSex = document.querySelector('input[name="sex"]:checked');
    const sexError = document.getElementById('register-sex-error');

    if (firstName.value.trim().length < 2) {
        setFieldState(firstName, false, 'Enter first name');
        isValid = false;
    } else {
        setFieldState(firstName, true);
    }

    if (lastName.value.trim().length < 2) {
        setFieldState(lastName, false, 'Enter last name');
        isValid = false;
    } else {
        setFieldState(lastName, true);
    }

    if (!isEmailValid(email.value.trim())) {
        setFieldState(email, false, 'Enter a valid email');
        isValid = false;
    } else {
        setFieldState(email, true);
    }

    if (password.value.trim().length < 6) {
        setFieldState(password, false, 'Password must contain at least 6 characters');
        isValid = false;
    } else {
        setFieldState(password, true);
    }

    if (confirmPassword.value !== password.value || confirmPassword.value === '') {
        setFieldState(confirmPassword, false, 'Passwords do not match');
        isValid = false;
    } else {
        setFieldState(confirmPassword, true);
    }

    if (!isPhoneValid(phone.value.trim())) {
        setFieldState(phone, false, 'Use format +380XXXXXXXXX');
        isValid = false;
    } else {
        setFieldState(phone, true);
    }

    if (!birthDate.value) {
        setFieldState(birthDate, false, 'Choose date of birth');
        isValid = false;
    } else {
        setFieldState(birthDate, true);
    }

    if (!selectedSex) {
        sexError.textContent = 'Choose sex';
        isValid = false;
    } else {
        sexError.textContent = '';
    }

    if (!registerCountry.value) {
        setFieldState(registerCountry, false, 'Choose country');
        isValid = false;
    } else {
        setFieldState(registerCountry, true);
    }

    if (!registerCity.value) {
        setFieldState(registerCity, false, 'Choose city');
        isValid = false;
    } else {
        setFieldState(registerCity, true);
    }

    return isValid;
};

const switchTab = (tab) => {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    state.activeTab = tab;
    state.queryParams.tab = tab;
    state.currentPage = 1;

    updateQueryParams(state.queryParams);
    applyFiltersAndRender();
};

const handleLogin = (e) => {
    e.preventDefault();

    if (!validateLoginForm()) return;

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    const user = {
        name: email.split('@')[0],
        email,
        password
    };

    localStorage.setItem('currentUser', JSON.stringify(user));

    state.currentUser = user;

    showMainApp();
    fetchUsers();
};

const handleRegister = (e) => {
    e.preventDefault();

    if (!validateRegisterForm()) return;

    const firstName = document.getElementById('register-first-name').value.trim();
    const lastName = document.getElementById('register-last-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;

    const user = {
        name: `${firstName} ${lastName}`,
        email,
        password
    };

    localStorage.setItem('currentUser', JSON.stringify(user));

    state.currentUser = user;

    showAuthMessage('Signup successful!');
    showMainApp();
    fetchUsers();
};

const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('favorites');

    state.currentUser = null;
    state.favorites = new Set();

    showAuthForm();
};

const handleEmailFilter = (e) => {
    state.queryParams.email = e.target.value.trim();
    state.queryParams.page = 1;

    updateQueryParams(state.queryParams);
    applyFiltersAndRender();
};

const fetchUsers = async () => {
    try {
        state.isLoading = true;
        loadingSpinner.classList.remove('hidden');
        errorMessage.classList.add('hidden');

        if (state.allUsersLoaded) {
            applyFiltersAndRender();
            return;
        }

        const response = await fetch(`https://randomuser.me/api/?results=100&seed=friendsearch`);

        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }

        const data = await response.json();

        const newUsers = data.results.map(user => ({
            id: user.login.uuid,
            name: `${user.name.first} ${user.name.last}`,
            firstName: user.name.first,
            lastName: user.name.last,
            age: user.dob.age,
            gender: user.gender,
            email: user.email,
            phone: user.phone,
            picture: user.picture.large,
            location: {
                city: user.location.city,
                country: user.location.country
            },
            registered: new Date(user.registered.date)
        }));

        state.users = [...state.users, ...newUsers];
        state.allUsersLoaded = true;

        localStorage.setItem('cachedUsers', JSON.stringify(state.users));

        updateCountryFilter();
        applyFiltersAndRender();
    } catch (err) {
        showError(err.message);
    } finally {
        state.isLoading = false;
        loadingSpinner.classList.add('hidden');
    }
};

const updateCountryFilter = () => {
    const countries = [...new Set(state.users.map(user => user.location.country))].sort();

    countryFilter.innerHTML = '<option value="all">All</option>';

    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countryFilter.appendChild(option);
    });

    if (state.queryParams.country && state.queryParams.country !== 'all') {
        countryFilter.value = state.queryParams.country;
    }
};

const applyFilters = () => {
    let filtered = [...state.users];

    if (state.queryParams.search) {
        const searchTerm = state.queryParams.search.toLowerCase();

        filtered = filtered.filter(user =>
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            user.location.city.toLowerCase().includes(searchTerm) ||
            user.location.country.toLowerCase().includes(searchTerm)
        );
    }

    if (state.queryParams.minAge) {
        filtered = filtered.filter(user => user.age >= state.queryParams.minAge);
    }

    if (state.queryParams.maxAge) {
        filtered = filtered.filter(user => user.age <= state.queryParams.maxAge);
    }

    if (state.queryParams.gender !== 'all') {
        filtered = filtered.filter(user => user.gender === state.queryParams.gender);
    }

    if (state.queryParams.country !== 'all') {
        filtered = filtered.filter(user => user.location.country === state.queryParams.country);
    }

    if (state.queryParams.email) {
        const emailTerm = state.queryParams.email.toLowerCase();

        filtered = filtered.filter(user =>
            user.email.toLowerCase().includes(emailTerm)
        );
    }

    filtered = sortUsers(filtered, state.queryParams.sort);

    if (state.activeTab === 'favorites') {
        filtered = filtered.filter(user => state.favorites.has(user.id));
    }

    state.filteredUsers = filtered;
    state.totalPages = Math.ceil(filtered.length / state.itemsPerPage);
    state.hasMore = state.currentPage < state.totalPages;
};

const sortUsers = (users, sortByValue) => {
    switch (sortByValue) {
        case 'name-asc':
            return [...users].sort((a, b) => a.name.localeCompare(b.name));
        case 'name-desc':
            return [...users].sort((a, b) => b.name.localeCompare(a.name));
        case 'age-asc':
            return [...users].sort((a, b) => a.age - b.age);
        case 'age-desc':
            return [...users].sort((a, b) => b.age - a.age);
        case 'registered-asc':
            return [...users].sort((a, b) => a.registered - b.registered);
        case 'registered-desc':
            return [...users].sort((a, b) => b.registered - a.registered);
        default:
            return users;
    }
};

const renderUsers = () => {
    const endIdx = state.currentPage * state.itemsPerPage;
    const usersToDisplay = state.filteredUsers.slice(0, endIdx);

    userCardsContainer.innerHTML = '';

    if (usersToDisplay.length === 0) {
        const message = state.activeTab === 'favorites'
            ? 'You have no favorite friends yet.'
            : 'No users found matching your criteria.';

        userCardsContainer.innerHTML = `<p class="no-results">${message}</p>`;
        updatePagination();
        return;
    }

    usersToDisplay.forEach(user => {
        const card = document.createElement('div');

        card.className = 'user-card';

        card.innerHTML = `
            <img src="${user.picture}" alt="${user.name}" class="user-card-img">
            <button class="favorite-btn ${state.favorites.has(user.id) ? 'favorited' : ''}" data-id="${user.id}">
                <i class="fas fa-heart"></i>
            </button>
            <div class="user-card-content">
                <h3 class="user-card-name">${user.name}</h3>
                <p class="user-card-info"><i class="fas fa-birthday-cake"></i> ${user.age} years old</p>
                <p class="user-card-info"><i class="fas fa-${user.gender === 'male' ? 'mars' : 'venus'}"></i> ${user.gender}</p>
                <p class="user-card-info"><i class="fas fa-phone"></i> ${user.phone}</p>
                <p class="user-card-info"><i class="fas fa-envelope"></i> ${user.email}</p>
                <p class="user-card-info"><i class="fas fa-map-marker-alt"></i> ${user.location.city}, ${user.location.country}</p>
                <p class="user-card-info"><i class="fas fa-calendar-alt"></i> Joined ${formatDate(user.registered)}</p>
            </div>
        `;

        userCardsContainer.appendChild(card);
    });

    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', toggleFavorite);
    });

    updatePagination();
};

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const applyFiltersAndRender = () => {
    searchInput.value = state.queryParams.search || '';
    minAgeInput.value = state.queryParams.minAge || '';
    maxAgeInput.value = state.queryParams.maxAge || '';
    genderFilter.value = state.queryParams.gender || 'all';
    countryFilter.value = state.queryParams.country || 'all';
    emailFilter.value = state.queryParams.email || '';
    sortBy.value = state.queryParams.sort || 'name-asc';

    applyFilters();
    renderUsers();
};

const handleSearch = (e) => {
    const searchTerm = e.target.value.trim();

    state.queryParams.search = searchTerm;
    state.currentPage = 1;

    updateQueryParams(state.queryParams);
    applyFiltersAndRender();
};

const handleFilterChange = () => {
    state.queryParams.minAge = minAgeInput.value ? parseInt(minAgeInput.value) : null;
    state.queryParams.maxAge = maxAgeInput.value ? parseInt(maxAgeInput.value) : null;
    state.queryParams.gender = genderFilter.value;
    state.queryParams.country = countryFilter.value;
    state.currentPage = 1;

    updateQueryParams(state.queryParams);
    applyFiltersAndRender();
};

const handleSortChange = () => {
    state.queryParams.sort = sortBy.value;
    state.currentPage = 1;

    updateQueryParams(state.queryParams);
    applyFiltersAndRender();
};

const toggleFavorite = (e) => {
    e.stopPropagation();

    const userId = e.currentTarget.getAttribute('data-id');

    if (state.favorites.has(userId)) {
        state.favorites.delete(userId);
        e.currentTarget.classList.remove('favorited');
    } else {
        state.favorites.add(userId);
        e.currentTarget.classList.add('favorited');
    }

    saveFavorites();

    if (state.activeTab === 'favorites') {
        applyFiltersAndRender();
    }
};

const loadFavorites = () => {
    const favorites = localStorage.getItem('favorites');

    if (favorites) {
        state.favorites = new Set(JSON.parse(favorites));
    }
};

const saveFavorites = () => {
    localStorage.setItem('favorites', JSON.stringify([...state.favorites]));
};

const updatePagination = () => {
    pageNumbersContainer.innerHTML = '';

    if (state.totalPages <= 0) {
        return;
    }

    addPageNumber(1);

    if (state.currentPage > 3) {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '...';
        pageNumbersContainer.appendChild(ellipsis);
    }

    const startPage = Math.max(2, state.currentPage - 1);
    const endPage = Math.min(state.totalPages - 1, state.currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
        if (i > 1 && i < state.totalPages) {
            addPageNumber(i);
        }
    }

    if (state.currentPage < state.totalPages - 2) {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '...';
        pageNumbersContainer.appendChild(ellipsis);
    }

    if (state.totalPages > 1) {
        addPageNumber(state.totalPages);
    }
};

const addPageNumber = (page) => {
    const pageNumber = document.createElement('span');

    pageNumber.className = 'page-number';

    if (page === state.currentPage) {
        pageNumber.classList.add('active');
    }

    pageNumber.textContent = page;

    pageNumber.addEventListener('click', () => {
        state.currentPage = page;
        renderUsers();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    pageNumbersContainer.appendChild(pageNumber);
};

const handleScroll = debounce(() => {
    if (state.isFetching || !state.hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const scrollPosition = scrollTop + clientHeight;

    if (scrollPosition >= scrollHeight * 0.8) {
        loadNextPage();
    }
}, 1000);

const loadNextPage = () => {
    if (state.currentPage >= state.totalPages) {
        state.hasMore = false;
        return;
    }

    state.isFetching = true;
    state.currentPage += 1;

    setTimeout(() => {
        renderUsers();
        state.isFetching = false;
    }, 500);
};

const showError = (message) => {
    state.error = message;

    errorMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    errorMessage.classList.remove('hidden');

    setTimeout(() => {
        errorMessage.classList.add('hidden');
    }, 5000);

    const activeButton = document.querySelector(`.tab-btn[data-tab="${state.activeTab}"]`);

    if (activeButton) {
        activeButton.classList.add('active');
    }
};

document.addEventListener('DOMContentLoaded', initApp);