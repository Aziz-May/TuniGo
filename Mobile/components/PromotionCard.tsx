import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

interface PromotionCardProps {
  image: any;
  title: string;
  agency: string;
  discount: string;
  originalPrice: string;
  discountedPrice: string;
  validUntil: string;
  type: 'agency' | 'guide';
}

export default function PromotionCard({
  image,
  title,
  agency,
  discount,
  originalPrice,
  discountedPrice,
  validUntil,
  type
}: PromotionCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.badgeContainer}>
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>-{discount}%</Text>
        </View>
        <View style={[styles.typeBadge, type === 'guide' ? styles.guideBadge : styles.agencyBadge]}>
          <Text style={styles.typeText}>{type}</Text>
        </View>
      </View>
      <Image source={image} style={styles.cardImage} />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.agencyContainer}>
          <Ionicons 
            name={type === 'guide' ? 'person' : 'business'} 
            size={16} 
            color="#666" 
          />
          <Text style={styles.agencyText}>{agency}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.originalPrice}>${originalPrice}</Text>
          <Text style={styles.discountedPrice}>${discountedPrice}</Text>
        </View>
        <View style={styles.validityContainer}>
          <Ionicons name="time-outline" size={14} color="#666" />
          <Text style={styles.validityText}>Valid until {validUntil}</Text>
        </View>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginRight: 16,
    width: 280,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  badgeContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 1,
    gap: 8,
  },
  discountBadge: {
    backgroundColor: '#FF4757',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  guideBadge: {
    backgroundColor: '#2ED573',
  },
  agencyBadge: {
    backgroundColor: '#1E90FF',
  },
  typeText: {
    color: 'white',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  cardImage: {
    width: '100%',
    height: 150,
  },
  contentContainer: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color : '#336749',
  },
  agencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  agencyText: {
    marginLeft: 6,
    color: '#666',
    fontSize: 14,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#666',
    textDecorationLine: 'line-through',
  },
  discountedPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2ED573',
  },
  validityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  validityText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
  },
  bookButton: {
    backgroundColor: '#336749',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});