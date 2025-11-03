import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  Timestamp,
  DocumentData,
  QuerySnapshot,
  QueryConstraint
} from 'firebase/firestore';
import { db } from './firebase';

export interface TrendingTopic {
  id: string;
  keyword: string;
  traffic: string;
  articles: Array<{
    title: string;
    url: string;
    source: string;
  }>;
  score: number;
  status: 'pending' | 'generating_script' | 'script_ready' | 'generating_assets' | 'assets_ready' | 'ready_to_publish' | 'published' | 'error';
  script?: any;
  analysis?: any;
  createdAt: Date;
  updatedAt: Date;
}

export async function getTrendingTopics(limitCount: number = 50): Promise<TrendingTopic[]> {
  const q = query(
    collection(db, 'trending_topics'),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as TrendingTopic[];
}

export async function getTrendingTopicsByStatus(status: string): Promise<TrendingTopic[]> {
  const q = query(
    collection(db, 'trending_topics'),
    where('status', '==', status),
    orderBy('createdAt', 'desc'),
    limit(50)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as TrendingTopic[];
}

export async function getTrendingTopic(id: string): Promise<TrendingTopic | null> {
  const docRef = doc(db, 'trending_topics', id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
    createdAt: docSnap.data().createdAt?.toDate() || new Date(),
    updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
  } as TrendingTopic;
}

export async function updateTrendingTopicStatus(
  id: string, 
  status: string,
  additionalData?: any
): Promise<void> {
  const docRef = doc(db, 'trending_topics', id);
  await updateDoc(docRef, {
    status,
    updatedAt: Timestamp.now(),
    ...additionalData,
  });
}

export async function getDashboardStats(): Promise<{
  totalTopics: number;
  pending: number;
  scriptReady: number;
  published: number;
  error: number;
}> {
  const [allTopics, pendingTopics, scriptReadyTopics, publishedTopics, errorTopics] = await Promise.all([
    getTrendingTopics(1000),
    getTrendingTopicsByStatus('pending'),
    getTrendingTopicsByStatus('script_ready'),
    getTrendingTopicsByStatus('published'),
    getTrendingTopicsByStatus('error'),
  ]);

  return {
    totalTopics: allTopics.length,
    pending: pendingTopics.length,
    scriptReady: scriptReadyTopics.length,
    published: publishedTopics.length,
    error: errorTopics.length,
  };
}

