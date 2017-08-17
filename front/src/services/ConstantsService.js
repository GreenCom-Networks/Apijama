

export default {
    API_URL: NODE_ENV === 'production' ? window.location.origin + ':3000' : SERVER_URL
}