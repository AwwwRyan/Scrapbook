'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { authApi } from '@/lib/api/auth';
import type { User } from '@/types/user';

export default function EditProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<Partial<User>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authApi.updateProfile(userData);
      router.push('/');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete your account?')) {
      try {
        await authApi.deleteProfile();
        localStorage.removeItem('token');
        router.push('/login');
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={userData.username || ''}
                onChange={(e) => setUserData({ ...userData, username: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={userData.email || ''}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={userData.password || ''}
                onChange={(e) => setUserData({ ...userData, password: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={userData.name || ''}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                value={userData.gender || ''}
                onChange={(e) => setUserData({ ...userData, gender: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={userData.dob || ''}
                onChange={(e) => setUserData({ ...userData, dob: e.target.value })}
              />
            </div>
            <div className="flex justify-between">
              <Button type="submit">Save Changes</Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete Account
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
} 