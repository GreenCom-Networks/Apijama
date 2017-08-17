export default {
    API_URL: (NODE_ENV === 'production' ? window.location.origin  : 'http://localhost') + ':3000'
}