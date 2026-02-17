import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { PortfolioConfig } from './types';

export function getPortfolioConfig(): PortfolioConfig {
    const configPath = path.join(process.cwd(), 'data', 'config.md');
    const fileContents = fs.readFileSync(configPath, 'utf-8');
    const { data } = matter(fileContents);
    return data as PortfolioConfig;
}
