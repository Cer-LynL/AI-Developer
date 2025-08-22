"""
Data processing module with intentional O(n²) performance issues
"""

class DataProcessor:
    def __init__(self):
        self.processed_count = 0
    
    def process_items(self, items):
        """
        Process a list of items
        Contains intentional O(n²) performance issue
        """
        processed_items = []
        
        # This is intentionally inefficient O(n²) algorithm
        for item in items:
            related_items = []
            
            # Nested loop creates O(n²) complexity
            for other_item in items:
                if self._are_related(item, other_item):
                    related_items.append(other_item)
            
            processed_item = {
                'id': item.get('id'),
                'name': item.get('name'),
                'related_count': len(related_items),
                'related_items': related_items
            }
            
            processed_items.append(processed_item)
        
        self.processed_count += len(processed_items)
        return processed_items
    
    def _are_related(self, item1, item2):
        """
        Check if two items are related
        Simple logic for demo purposes
        """
        if not item1 or not item2:
            return False
        
        # Simple relationship check
        return (item1.get('category') == item2.get('category') and 
                item1.get('id') != item2.get('id'))
    
    def bulk_process(self, item_batches):
        """
        Process multiple batches - also inefficient
        """
        all_results = []
        
        # Another inefficient nested loop
        for batch in item_batches:
            batch_results = []
            for item in batch:
                # Process each item against all other items in all batches
                for other_batch in item_batches:
                    for other_item in other_batch:
                        if self._are_related(item, other_item):
                            batch_results.append({
                                'item': item,
                                'related': other_item,
                                'batch_id': item_batches.index(batch)
                            })
            all_results.extend(batch_results)
        
        return all_results
    
    def get_stats(self):
        """Get processing statistics"""
        return {
            'total_processed': self.processed_count,
            'algorithm_complexity': 'O(n²)',
            'performance_issue': True
        }
