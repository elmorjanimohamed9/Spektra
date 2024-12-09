import { createSlice } from '@reduxjs/toolkit';
import themeConfig from '../theme.config';

const initialState = {
    isDarkMode: false,
    theme: localStorage.getItem('theme') || themeConfig.theme,
};

const themeConfigSlice = createSlice({
    name: 'themeConfig',
    initialState: initialState,
    reducers: {
        toggleTheme(state, { payload }) {
            payload = payload || state.theme; // light | dark | system
            localStorage.setItem('theme', payload);
            state.theme = payload;
            if (payload === 'light') {
                state.isDarkMode = false;
            } else if (payload === 'dark') {
                state.isDarkMode = true;
            } else if (payload === 'system') {
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    state.isDarkMode = true;
                } else {
                    state.isDarkMode = false;
                }
            }

            if (state.isDarkMode) {
                document.querySelector('body')?.classList.add('dark');
            } else {
                document.querySelector('body')?.classList.remove('dark');
            }
        },
    },
});

export const { toggleTheme } = themeConfigSlice.actions;

export default themeConfigSlice.reducer;
