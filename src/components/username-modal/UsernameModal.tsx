import { useState, type ChangeEvent } from 'react';
import { Input } from '../../ui-components/input/Input';
import styles from './usernameModal.module.scss';
import { Button } from '../../ui-components/button/Button';

export const UsernameModal = () => {
    const [username, setUsername] = useState('');

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setUsername(value);
    };

    const sendUsername = () => {
        console.log('USERNAME: ', username);
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