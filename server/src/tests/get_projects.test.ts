import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { projectsTable } from '../db/schema';
import { type CreateProjectInput } from '../schema';
import { getProjects, getFeaturedProjects } from '../handlers/get_projects';

// Test project inputs
const testProject1: CreateProjectInput = {
  title: 'Portfolio Website',
  description: 'A personal portfolio website built with React and TypeScript',
  technologies: ['React', 'TypeScript', 'Tailwind CSS'],
  project_url: 'https://portfolio.example.com',
  github_url: 'https://github.com/user/portfolio',
  image_url: 'https://example.com/portfolio.jpg',
  is_featured: true
};

const testProject2: CreateProjectInput = {
  title: 'E-commerce API',
  description: 'RESTful API for an e-commerce platform',
  technologies: ['Node.js', 'Express', 'PostgreSQL'],
  project_url: null,
  github_url: 'https://github.com/user/ecommerce-api',
  image_url: null,
  is_featured: false
};

const testProject3: CreateProjectInput = {
  title: 'Task Manager App',
  description: 'A collaborative task management application',
  technologies: ['Vue.js', 'Firebase', 'Vuetify'],
  project_url: 'https://taskmanager.example.com',
  github_url: null,
  image_url: 'https://example.com/taskmanager.jpg',
  is_featured: true
};

describe('getProjects', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no projects exist', async () => {
    const result = await getProjects();
    expect(result).toEqual([]);
  });

  it('should return all projects ordered by created_at descending', async () => {
    // Insert test projects with slight delay to ensure different created_at timestamps
    await db.insert(projectsTable).values(testProject1).execute();
    
    // Small delay to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));
    
    await db.insert(projectsTable).values(testProject2).execute();
    
    await new Promise(resolve => setTimeout(resolve, 10));
    
    await db.insert(projectsTable).values(testProject3).execute();

    const result = await getProjects();

    expect(result).toHaveLength(3);
    
    // Verify ordering - most recent first
    expect(result[0].title).toEqual('Task Manager App');
    expect(result[1].title).toEqual('E-commerce API');
    expect(result[2].title).toEqual('Portfolio Website');
    
    // Verify all fields are properly returned
    expect(result[0].description).toEqual(testProject3.description);
    expect(result[0].technologies).toEqual(testProject3.technologies);
    expect(result[0].project_url).toEqual(testProject3.project_url);
    expect(result[0].github_url).toEqual(testProject3.github_url);
    expect(result[0].image_url).toEqual(testProject3.image_url);
    expect(result[0].is_featured).toEqual(true);
    expect(result[0].id).toBeDefined();
    expect(result[0].created_at).toBeInstanceOf(Date);
  });

  it('should return projects with proper data types', async () => {
    await db.insert(projectsTable).values(testProject1).execute();

    const result = await getProjects();

    expect(result).toHaveLength(1);
    expect(typeof result[0].id).toBe('number');
    expect(typeof result[0].title).toBe('string');
    expect(typeof result[0].description).toBe('string');
    expect(Array.isArray(result[0].technologies)).toBe(true);
    expect(typeof result[0].is_featured).toBe('boolean');
    expect(result[0].created_at).toBeInstanceOf(Date);
  });

  it('should handle projects with null optional fields', async () => {
    await db.insert(projectsTable).values(testProject2).execute();

    const result = await getProjects();

    expect(result).toHaveLength(1);
    expect(result[0].project_url).toBeNull();
    expect(result[0].image_url).toBeNull();
    expect(result[0].github_url).toEqual('https://github.com/user/ecommerce-api');
  });
});

describe('getFeaturedProjects', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no featured projects exist', async () => {
    // Insert non-featured project
    await db.insert(projectsTable).values(testProject2).execute();

    const result = await getFeaturedProjects();
    expect(result).toEqual([]);
  });

  it('should return only featured projects ordered by created_at descending', async () => {
    // Insert mix of featured and non-featured projects
    await db.insert(projectsTable).values(testProject1).execute(); // featured
    
    await new Promise(resolve => setTimeout(resolve, 10));
    
    await db.insert(projectsTable).values(testProject2).execute(); // not featured
    
    await new Promise(resolve => setTimeout(resolve, 10));
    
    await db.insert(projectsTable).values(testProject3).execute(); // featured

    const result = await getFeaturedProjects();

    expect(result).toHaveLength(2);
    
    // Verify only featured projects are returned
    expect(result.every(project => project.is_featured)).toBe(true);
    
    // Verify ordering - most recent featured first
    expect(result[0].title).toEqual('Task Manager App');
    expect(result[1].title).toEqual('Portfolio Website');
  });

  it('should return all featured projects when all projects are featured', async () => {
    // Make all projects featured
    const featuredProject2 = { ...testProject2, is_featured: true };
    
    await db.insert(projectsTable).values(testProject1).execute();
    await db.insert(projectsTable).values(featuredProject2).execute();
    await db.insert(projectsTable).values(testProject3).execute();

    const result = await getFeaturedProjects();

    expect(result).toHaveLength(3);
    expect(result.every(project => project.is_featured)).toBe(true);
  });

  it('should return featured projects with all required fields', async () => {
    await db.insert(projectsTable).values(testProject1).execute();

    const result = await getFeaturedProjects();

    expect(result).toHaveLength(1);
    const project = result[0];
    
    expect(project.id).toBeDefined();
    expect(project.title).toEqual('Portfolio Website');
    expect(project.description).toEqual('A personal portfolio website built with React and TypeScript');
    expect(project.technologies).toEqual(['React', 'TypeScript', 'Tailwind CSS']);
    expect(project.project_url).toEqual('https://portfolio.example.com');
    expect(project.github_url).toEqual('https://github.com/user/portfolio');
    expect(project.image_url).toEqual('https://example.com/portfolio.jpg');
    expect(project.is_featured).toBe(true);
    expect(project.created_at).toBeInstanceOf(Date);
  });

  it('should handle featured projects with mixed null and non-null optional fields', async () => {
    const mixedProject: CreateProjectInput = {
      title: 'Mixed Fields Project',
      description: 'A project with mixed null and non-null optional fields',
      technologies: ['JavaScript'],
      project_url: 'https://mixed.example.com',
      github_url: null,
      image_url: null,
      is_featured: true
    };

    await db.insert(projectsTable).values(mixedProject).execute();

    const result = await getFeaturedProjects();

    expect(result).toHaveLength(1);
    expect(result[0].project_url).toEqual('https://mixed.example.com');
    expect(result[0].github_url).toBeNull();
    expect(result[0].image_url).toBeNull();
    expect(result[0].is_featured).toBe(true);
  });
});