import { supabase } from '@/lib/supabase'
import { Friend } from '@/types'

export const friendService = {
  async getFriends(): Promise<Friend[]> {
    const { data, error } = await supabase
      .from('friends')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map(friend => ({
      id: friend.id,
      name: friend.name,
      email: friend.email,
      avatarUrl: friend.avatar_url,
      userId: friend.user_id,
      createdAt: friend.created_at,
      updatedAt: friend.updated_at,
    }))
  },

  async createFriend(friendData: Omit<Friend, 'id' | 'createdAt' | 'updatedAt'>): Promise<Friend> {
    const { data, error } = await supabase
      .from('friends')
      .insert({
        name: friendData.name,
        email: friendData.email,
        avatar_url: friendData.avatarUrl,
        user_id: friendData.userId,
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      avatarUrl: data.avatar_url,
      userId: data.user_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  },

  async updateFriend(friendId: string, updates: Partial<Pick<Friend, 'name' | 'email' | 'avatarUrl'>>): Promise<Friend> {
    const { data, error } = await supabase
      .from('friends')
      .update({
        name: updates.name,
        email: updates.email,
        avatar_url: updates.avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', friendId)
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      avatarUrl: data.avatar_url,
      userId: data.user_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  },

  async deleteFriend(friendId: string): Promise<void> {
    const { error } = await supabase
      .from('friends')
      .delete()
      .eq('id', friendId)

    if (error) throw error
  },
}