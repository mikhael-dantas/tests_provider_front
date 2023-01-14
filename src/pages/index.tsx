import Link from 'next/link';
import React from 'react';

// import { Container } from './styles';

const RootPage: React.FC = () => {
  return (
    <div>
      <h1>Root Page</h1>
      <h2>Go to Management</h2>
      <Link href="/management">
        Management
      </Link>
    </div>

  )
}

export default RootPage;