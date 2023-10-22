import { render, screen } from '@testing-library/react'
import RegisterForm from './RegisterForm';
import { BrowserRouter } from 'react-router-dom';

test('check submit button', () => {
    render(<BrowserRouter>
        <RegisterForm />
    </BrowserRouter>);
    const btnElement = screen.getByRole("button");
    expect(btnElement).toBeEnabled();
});
