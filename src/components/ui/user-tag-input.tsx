import React, { useState, useEffect } from 'react';
import { api } from '@/trpc/react';
import { Input } from './input';
import { PiX } from 'react-icons/pi';
import Image from 'next/image';
import { Avatar } from './Avatar';

interface UserTagInputProps {
    value: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
}

export function UserTagInput({ value, onChange, placeholder }: UserTagInputProps) {
    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState<Array<{ username: string; image: string | null; id: string }>>([]);

    const { data: users, refetch } = api.user.searchUsers.useQuery(
        { query: input },
        { enabled: false }
    );

    useEffect(() => {
        if (input.length > 0) {
            void refetch();
        } else {
            setSuggestions([]);
        }
    }, [input, refetch]);

    useEffect(() => {
        if (users) {
            setSuggestions(users.map((user) => ({
                username: user.username ?? '',
                id: user.id,
                image: user.image
            })).filter(user => user.username));
        }
    }, [users]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newInput = e.target.value;
        setInput(newInput);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && input.trim()) {
            e.preventDefault();
            const newTag = input.trim();
            if (!value.includes(newTag) && suggestions.some(s => s.username === newTag)) {
                onChange([...value, newTag]);
                setInput('');
                setSuggestions([]);
            }
        }
    };

    const removeTag = (tagToRemove: string) => {
        onChange(value.filter(tag => tag !== tagToRemove));
    };

    return (
        <div className="flex flex-wrap gap-2">
            {value.map(tag => (
                <span key={tag} className="bg-gray-200 px-2 py-1 rounded-full text-sm items-center flex">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="ml-2 text-red-500"><PiX /></button>
                </span>
            ))}
            <div className="relative w-full">
                <Input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder || "Tag users..."}
                    className="border border-stroke rounded px-2 py-1"
                />
                {suggestions.length > 0 && (
                    <ul className="absolute z-10 bg-white border border-stroke mt-2 w-full rounded-lg shadow-sm">
                        {suggestions.map(suggestion => (
                            <li
                                key={suggestion.username}
                                onClick={() => {
                                    onChange([...value, suggestion.username]);
                                    setInput('');
                                    setSuggestions([]);
                                }}
                                className="px-2 py-1 hover:bg-gray-100 cursor-pointer flex items-center"
                            >
                                {suggestion.image && (
                                    <Avatar className='mr-2' size='xxs' image={suggestion.image} id={suggestion.id} username={suggestion.username} />
                                )}
                                {suggestion.username}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}