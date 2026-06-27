import {Platform, StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  authRoot: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  authScreen: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  authCard: {
    backgroundColor: '#111827',
    borderRadius: 24,
    padding: 24,
  },
  authHeader: {
    marginBottom: 24,
  },
  authTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
  },
  authSubtitle: {
    color: '#94A3B8',
    fontSize: 15,
    lineHeight: 22,
  },
  input: {
    backgroundColor: '#1F2937',
    color: '#FFFFFF',
    borderColor: '#374151',
    borderRadius: 16,
    borderWidth: 1,
    fontSize: 16,
    marginBottom: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#6366F1',
    borderRadius: 16,
    marginTop: 4,
    paddingVertical: 16,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  linkButton: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  linkText: {
    color: '#CBD5E1',
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    color: '#0F172A',
    fontSize: 24,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 2,
  },
  headerBadge: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  headerBadgeText: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '700',
  },
  onlineDot: {
    backgroundColor: '#10B981',
    borderRadius: 4,
    height: 8,
    marginRight: 6,
    width: 8,
  },
  content: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  cardRow: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    flexDirection: 'row',
    marginBottom: 12,
    padding: 14,
  },
  cardCopy: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
  },
  cardSubtitle: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 2,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#4338CA',
    fontWeight: '800',
  },
  pillButton: {
    backgroundColor: '#EEF2FF',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  pillButtonText: {
    color: '#4338CA',
    fontSize: 13,
    fontWeight: '700',
  },
  disabledPillButton: {
    backgroundColor: '#E2E8F0',
  },
  disabledPillText: {
    color: '#64748B',
  },
  inlineActions: {
    flexDirection: 'row',
  },
  smallButton: {
    alignItems: 'center',
    backgroundColor: '#334155',
    borderRadius: 12,
    justifyContent: 'center',
    marginLeft: 8,
    minWidth: 72,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  smallButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  acceptButton: {
    backgroundColor: '#16A34A',
  },
  rejectButton: {
    backgroundColor: '#DC2626',
  },
  videoButton: {
    backgroundColor: '#0F766E',
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 28,
  },
  emptyTitle: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptySubtitle: {
    color: '#64748B',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    textAlign: 'center',
  },
  tabBarWrapper: {
    alignItems: 'center',
    bottom: Platform.OS === 'ios' ? 28 : 20,
    left: 20,
    position: 'absolute',
    right: 20,
  },
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    flexDirection: 'row',
    maxWidth: 360,
    padding: 8,
    width: '100%',
  },
  tabItem: {
    alignItems: 'center',
    borderRadius: 999,
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  tabItemActive: {
    backgroundColor: '#EEF2FF',
  },
  tabLabel: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: '#4338CA',
  },
  badge: {
    alignItems: 'center',
    backgroundColor: '#DC2626',
    borderRadius: 999,
    height: 20,
    justifyContent: 'center',
    minWidth: 20,
    position: 'absolute',
    right: 16,
    top: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  chatScreen: {
    backgroundColor: '#F8FAFC',
    flex: 1,
  },
  chatHeader: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backButton: {
    marginRight: 10,
    paddingVertical: 6,
  },
  backButtonText: {
    color: '#4338CA',
    fontSize: 14,
    fontWeight: '700',
  },
  chatHeaderCopy: {
    flex: 1,
    marginLeft: 12,
  },
  chatHeaderTitle: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
  },
  chatHeaderSubtitle: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2,
  },
  chatList: {
    padding: 16,
  },
  messageRow: {
    marginBottom: 14,
  },
  messageRowMine: {
    alignItems: 'flex-end',
  },
  messageRowTheirs: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    maxWidth: '82%',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  messageBubbleMine: {
    backgroundColor: '#6366F1',
  },
  messageText: {
    color: '#0F172A',
    fontSize: 15,
    lineHeight: 20,
  },
  messageTextMine: {
    color: '#FFFFFF',
  },
  messageTimestamp: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 4,
  },
  chatComposer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  chatInput: {
    backgroundColor: '#F1F5F9',
    borderRadius: 999,
    color: '#0F172A',
    flex: 1,
    fontSize: 15,
    marginRight: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  callScreen: {
    backgroundColor: '#020617',
    flex: 1,
    justifyContent: 'center',
  },
  remoteVideo: {
    flex: 1,
  },
  callWaitingState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  callTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    marginTop: 16,
  },
  callSubtitle: {
    color: '#94A3B8',
    fontSize: 15,
    marginTop: 8,
  },
  localPreviewShell: {
    borderRadius: 18,
    height: 180,
    overflow: 'hidden',
    position: 'absolute',
    right: 20,
    top: 60,
    width: 120,
  },
  localPreview: {
    flex: 1,
  },
  callActions: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 28,
    paddingTop: 16,
  },
});
