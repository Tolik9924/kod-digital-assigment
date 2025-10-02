import { useState, type ChangeEvent } from 'react';
import { fetchMovies } from '../../features/movies/moviesThunks';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../app/store';
import { Input } from '../../ui-components/input/Input';
import { Button } from '../../ui-components/button/Button';
import styles from './usernameModal.module.scss';

export const UsernameModal = ({
    sendData
}: {
    sendData: () => void;
}) => {
    const [username, setUsername] = useState('');
    const { searchTitle } = useSelector(
    (state: RootState) => state.movies
  );
    const dispatch = useDispatch<AppDispatch>();

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setUsername(value);
    };

    const sendUsername = async () => {
        const oldUsername = localStorage.getItem('username');
        setUsername('');
        await localStorage.setItem('username', username);
        await sendData();
        if (oldUsername !== username) {
            await dispatch(fetchMovies(searchTitle));
        }
    };

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Enter Username</h3>
            <Input label='username' value={username} handleChange={handleChange} size="m" fullWidth />
            <div className={styles.sendContainer}>
                <Button onClick={sendUsername} fullWidth size="s">Send</Button>
            </div>
        </div>
    )
};