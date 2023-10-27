import { render, screen } from '@testing-library/react'
'react-router-dom'
import NoMatch from '../pages/no-match/NoMatch';

describe('No Match Page', () => {
    render(<NoMatch/>)

    test('expects span element with text content "Page Not Found" to be in the document', () => {

        expect(screen.getByTestId("not found")).toBeInTheDocument();
    })
})


