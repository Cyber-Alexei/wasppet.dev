import Link from 'next/link';
import Container from '@mui/material/Container';

export const Footer = (): JSX.Element => {
    return (
        <footer className='flex items-center justify-center w-full min-h-[80px]'>
            <Container>
                <Link href='/'>
                    <div className='inline text-primary-font-color'>
                        Wasppet.dev 2024
                    </div>
                </Link>
            </Container>
        </footer>
    )
}