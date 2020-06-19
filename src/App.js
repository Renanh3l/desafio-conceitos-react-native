import React, { useEffect, useState } from "react";
import api from "./services/api";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function App() {
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    api.get("repositories").then((response) => {
      setRepos(response.data);
    });
  }, []);

  async function handleLikeRepository(id) {
    // Implement "Like Repository" functionality
    const response = await api.post(`repositories/${id}/like`);

    if (response.status === 200) {
      const repoIndex = repos.findIndex((repo) => repo.id === id);
      const newRepos = repos;
      newRepos[repoIndex] = response.data;
      setRepos([...newRepos]);
    }
  }

  async function handleDeleteRepository(id) {
    const response = await api.delete(`repositories/${id}`);

    if (response.status === 204) {
      const repoIndex = repos.findIndex((repo) => repo.id === id);
      const newRepos = repos;
      newRepos.splice(repoIndex, 1);
      setRepos([...newRepos]);
    }
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#7159c1" />

      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.fabRefresh}>
          <Text>Refresh</Text>
        </TouchableOpacity>
        <Text style={styles.appTitle}>Meus Repositórios</Text>
        <FlatList
          data={repos}
          keyExtractor={(repo) => repo.id}
          renderItem={({ item: repo }) => (
            <View style={styles.repositoryContainer}>
              <Text style={styles.repository}>{repo.title}</Text>

              <View style={styles.techsContainer}>
                {repo.techs.map((tech) => (
                  <Text key={tech} style={styles.tech}>
                    {tech}
                  </Text>
                ))}
              </View>

              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  // Remember to replace "1" below with repository ID: {`repository-likes-${repository.id}`}
                  testID={`repository-likes-${repo.id}`}
                >
                  {repo.likes} curtidas
                </Text>
              </View>

              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleLikeRepository(repo.id)}
                  // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
                  testID={`like-button-${repo.id}`}
                >
                  <Text style={styles.buttonText}>Curtir</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.alertButton}
                  onPress={() => handleDeleteRepository(repo.id)}
                  // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
                  testID={`like-button-${repo.id}`}
                >
                  <Text style={styles.buttonText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
    position: "relative",
  },
  appTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
    marginVertical: 16,
  },
  fabRefresh: {
    backgroundColor: "#7159c1",
    borderRadius: 50,
    width: 60,
    height: 60,
    position: "absolute",
    bottom: 16,
    right: 16,
    zIndex: 15,
    shadowColor: "#000",
    elevation: 5,
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  actionsContainer: {
    flexDirection: "row",
  },
  button: {
    flex: 1,
    marginTop: 10,
    backgroundColor: "#7159c1",
    marginRight: 8,
  },
  alertButton: {
    flex: 1,
    marginTop: 10,
    backgroundColor: "red",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    padding: 15,
    textAlign: "center",
  },
});
